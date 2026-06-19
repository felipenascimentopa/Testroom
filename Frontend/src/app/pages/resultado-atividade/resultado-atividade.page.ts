import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AtividadeService } from '../../services/atividade.service';
import { RespostaService } from '../../services/resposta.service';
import { AuthService } from '../../services/auth.service';
import { AtividadeModel } from '../../model/atividade.model';
import { RespostaAtividadeModel } from '../../model/resposta-atividade.model';
import { firstValueFrom } from 'rxjs';
import { QuestaoService } from '../../services/questao.service';
import { QuestaoModel } from '../../model/questao.model';
import { AlternativaModel } from '../../model/alternativa.model';
import { LatexPipe } from 'src/pipes/latex.pipe';

interface DetalheResposta {
  id: number;
  idRespostaAtividade: number;
  idQuestao: number;
  respostaTexto: string;
  acerto: boolean;
}

@Component({
  selector: 'app-resultado-atividade',
  templateUrl: './resultado-atividade.page.html',
  styleUrls: ['./resultado-atividade.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, LatexPipe]
})
export class ResultadoAtividadePage implements OnInit {
  atividadeId: number = 0;
  atividade: AtividadeModel | null = null;
  resposta: RespostaAtividadeModel | null = null;
  detalhes: DetalheResposta[] = [];
  questoes: QuestaoModel[] = [];
  carregando = true;
  totalPontos: number = 0;
  notaCorte: number = 0;
  notaFinal: number = 0;
  alternativasDaQuestao: { [key: number]: AlternativaModel[] } = {};

  constructor(
    private route: ActivatedRoute,
    private atividadeService: AtividadeService,
    private respostaService: RespostaService,
    private questaoService: QuestaoService,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.atividadeId = idParam ? +idParam : 0;
    if (!this.atividadeId || isNaN(this.atividadeId)) {
      this.mostrarToast('ID da atividade inválido');
      this.navCtrl.back();
      return;
    }
    this.carregarDados();
  }

  async carregarDados() {
    try {
      const alunoId = this.authService.obterUsuarioSessao()?.id || 0;
      
      this.atividade = await firstValueFrom(this.atividadeService.buscarPorId(this.atividadeId));
      this.resposta = await firstValueFrom(this.respostaService.obterResultados(alunoId, this.atividadeId));
      
      this.notaFinal = await firstValueFrom(this.respostaService.obterNotaFinal(alunoId, this.atividadeId));

      if (this.resposta?.id) {
        this.detalhes = await firstValueFrom(this.respostaService.obterDetalhes(this.resposta.id));
        this.detalhes = this.detalhes.map(d => ({ ...d, acerto: d.acerto === true }));
      }
      
      this.questoes = await firstValueFrom(this.questaoService.listarPorAtividade(this.atividadeId));
      
      for (const q of this.questoes) {
        if (['VF', 'UNICA_ESCOLHA', 'MULTIPLA_ESCOLHA'].includes(q.tipoPergunta)) {
          this.alternativasDaQuestao[q.id!] = await firstValueFrom(this.questaoService.listarAlternativas(q.id!));
        }
      }

      this.totalPontos = this.questoes.reduce((sum, q) => sum + (q.peso || 0), 0);
      this.notaCorte = this.totalPontos * 0.6;
    } catch (error) {
      console.error(error);
      this.mostrarToast('Erro ao carregar resultado');
    } finally {
      this.carregando = false;
    }
  }

  getRespostaParaQuestao(questaoId: number): DetalheResposta | undefined {
    return this.detalhes.find(d => d.idQuestao === questaoId);
  }

  getTextoAlternativa(questaoId: number, idAlternativa: number): string | null {
    const alt = this.alternativasDaQuestao[questaoId]?.find(a => a.id === idAlternativa);
    return alt ? alt.texto : null;
  }

  getFeedbackAlternativa(questaoId: number, idAlternativa: number): string | null {
    const alt = this.alternativasDaQuestao[questaoId]?.find(a => a.id === idAlternativa);
    return alt && alt.feedback ? alt.feedback : null;
  }

  voltar() {
    this.navCtrl.navigateBack(`/menu/detalhes-turma/${this.atividade?.idTurma}`);
  }

  async mostrarToast(mensagem: string) {
    const toast = await this.toastCtrl.create({ message: mensagem, duration: 2000 });
    toast.present();
  }
}