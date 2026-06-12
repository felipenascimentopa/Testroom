import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AtividadeService } from '../../services/atividade.service';
import { QuestaoService } from '../../services/questao.service';
import { RespostaService } from '../../services/resposta.service';
import { AuthService } from '../../services/auth.service';
import { AtividadeModel } from '../../model/atividade.model';
import { QuestaoModel } from '../../model/questao.model';
import { AlternativaModel } from '../../model/alternativa.model';
import { firstValueFrom } from 'rxjs';
import { LatexPipe } from 'src/pipes/latex.pipe';

@Component({
  selector: 'app-responder-atividade',
  templateUrl: './responder-atividade.page.html',
  styleUrls: ['./responder-atividade.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, LatexPipe]
})
export class ResponderAtividadePage implements OnInit {
  atividadeId: number = 0;
  atividade: AtividadeModel | null = null;
  questoes: QuestaoModel[] = [];
  alternativasPorQuestao: { [key: number]: AlternativaModel[] } = {};
  respostas: { [key: number]: any } = {};
  respostasMultiplas: { [key: number]: { [altId: number]: boolean } } = {};

  constructor(
    private route: ActivatedRoute,
    private atividadeService: AtividadeService,
    private questaoService: QuestaoService,
    private respostaService: RespostaService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.atividadeId = +this.route.snapshot.paramMap.get('id')!;
    this.carregarDados();
  }

  async carregarDados() {
    try {
      this.atividade = await firstValueFrom(this.atividadeService.buscarPorId(this.atividadeId));
      this.questoes = await firstValueFrom(this.questaoService.listarPorAtividade(this.atividadeId));
      for (const q of this.questoes) {
        if (['VF', 'UNICA_ESCOLHA', 'MULTIPLA_ESCOLHA'].includes(q.tipoPergunta)) {
          this.alternativasPorQuestao[q.id!] = await firstValueFrom(this.questaoService.listarAlternativas(q.id!));
        }
        if (q.tipoPergunta === 'MULTIPLA_ESCOLHA') {
          this.respostasMultiplas[q.id!] = {};
        }
      }
    } catch (error) {
      console.error(error);
      this.mostrarToast('Erro ao carregar atividade');
    }
  }

  async enviarRespostas() {
    const payload: any = {};
    for (const q of this.questoes) {
      if (q.tipoPergunta === 'MULTIPLA_ESCOLHA') {
        const selecionadas = Object.entries(this.respostasMultiplas[q.id!])
          .filter(([_, value]) => value)
          .map(([altId]) => +altId);
        payload[q.id!] = selecionadas;
      } else {
        payload[q.id!] = this.respostas[q.id!];
      }
    }

    const alunoId = this.authService.obterUsuarioSessao()?.id || 0;
    try {
      await firstValueFrom(this.respostaService.submeter(this.atividadeId, alunoId, payload, 0));
      this.navCtrl.navigateForward(`/menu/resultado-atividade/${this.atividadeId}`);
    } catch (error: any) {
      let mensagem = 'Erro ao enviar respostas.';
      if (error.status === 409) {
        mensagem = 'Você já respondeu esta atividade.';
      } else if (error.status === 500) {
        mensagem = 'Erro interno no servidor. Tente novamente.';
      }
      this.mostrarToast(mensagem);
    }
  }

  async mostrarToast(mensagem: string) {
    const toast = await this.toastCtrl.create({ message: mensagem, duration: 3000 });
    toast.present();
  }
}