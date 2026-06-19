import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController, ModalController, NavController } from '@ionic/angular'; // Importe os serviços aqui
import { ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { QuestaoService } from '../../services/questao.service';
import { AtividadeService } from '../../services/atividade.service';
import { QuestaoModel } from '../../model/questao.model';
import { AlternativaModel } from '../../model/alternativa.model';
import { AdicionarEditarQuestaoComponent } from '../../components/adicionar-editar-questao/adicionar-editar-questao.component';
import { LatexPipe } from 'src/pipes/latex.pipe';

@Component({
  selector: 'app-gerenciar-questoes',
  templateUrl: './gerenciar-questoes.page.html',
  styleUrls: ['./gerenciar-questoes.page.scss'],
  standalone: true,
  // IMPORTANTE: NÃO coloque NavController aqui! Apenas componentes/pipes.
  imports: [CommonModule, IonicModule, RouterModule, LatexPipe] 
})
export class GerenciarQuestoesPage implements OnInit {
  atividadeId: number = 0;
  atividadeTitulo: string = '';
  questoes: (QuestaoModel & { alternativas?: AlternativaModel[] })[] = [];
  carregando = true;

  constructor(
    private route: ActivatedRoute,
    private questaoService: QuestaoService,
    private atividadeService: AtividadeService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private navCtrl: NavController // Serviço injetado aqui, fora do imports
  ) {}

  ngOnInit() {
    this.atividadeId = +this.route.snapshot.paramMap.get('atividadeId')!;
    this.carregarDados();
  }

  async carregarDados(event?: any) {
    try {
      const atividade = await firstValueFrom(this.atividadeService.buscarPorId(this.atividadeId));
      this.atividadeTitulo = atividade.titulo;
      this.questoes = await firstValueFrom(this.questaoService.listarPorAtividade(this.atividadeId));
      for (const q of this.questoes) {
        if (['VF', 'UNICA_ESCOLHA', 'MULTIPLA_ESCOLHA'].includes(q.tipoPergunta)) {
          q.alternativas = await firstValueFrom(this.questaoService.listarAlternativas(q.id!));
        }
      }
    } catch (error) {
      console.error(error);
      this.mostrarToast('Erro ao carregar questões');
    } finally {
      this.carregando = false;
      if (event) event.target.complete();
    }
  }

  // Método para ir ao banco de questões
  irParaBancoDeQuestoes() {
    this.navCtrl.navigateForward(`/menu/selecionar-questoes-banco/${this.atividadeId}`);
  }

  async abrirModal(questao?: QuestaoModel) {
    const modal = await this.modalCtrl.create({
      component: AdicionarEditarQuestaoComponent,
      componentProps: {
        atividadeId: this.atividadeId,
        questaoEdicao: questao
      }
    });
    modal.onDidDismiss().then(result => {
      if (result.data?.success) {
        this.carregarDados();
      }
    });
    await modal.present();
  }

  async excluirQuestao(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir esta questão?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Excluir', 
          handler: async () => {
            try {
              await firstValueFrom(this.questaoService.excluir(id));
              this.mostrarToast('Questão excluída com sucesso');
              this.carregarDados();
            } catch (error) {
              this.mostrarToast('Erro ao excluir questão');
            }
          }
        }
      ]
    });
    alert.present();
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, position: 'bottom' });
    toast.present();
  }
}