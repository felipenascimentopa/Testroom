import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
  IonContent, IonList, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonBadge, IonItem, IonInput,
  IonTextarea
} from '@ionic/angular/standalone';
import { ToastController, AlertController, NavController } from '@ionic/angular';
import { TurmaService } from '../../services/turma.service';
import { AtividadeService } from '../../services/atividade.service';
import { MatriculaService } from '../../services/matricula.service';
import { ModalController } from '@ionic/angular';
import { EditarAtividadeComponent } from '../../components/editar-atividade/editar-atividade.component';
import { AlunoService } from '../../services/aluno.service';
import { AuthService } from '../../services/auth.service';
import { RespostaService } from '../../services/resposta.service';
import { TurmaModel } from '../../model/turma.model';
import { AtividadeModel } from '../../model/atividade.model';
import { AlunoModel } from '../../model/aluno.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-turma-detalhe',
  templateUrl: './turma-detalhe.page.html',
  styleUrls: ['./turma-detalhe.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel,
    IonContent, IonList, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonBadge, IonItem, IonInput, IonTextarea, EditarAtividadeComponent
  ]
})
export class TurmaDetalhePage implements OnInit {
  turmaId: number = 0;
  turma: TurmaModel | null = null;
  atividades: AtividadeModel[] = [];
  alunos: AlunoModel[] = [];
  abaAtual = 'atividades';
  isProfessor = false;
  jaRespondeu: { [atividadeId: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private turmaService: TurmaService,
    private atividadeService: AtividadeService,
    private matriculaService: MatriculaService,
    private alunoService: AlunoService,
    private authService: AuthService,
    private respostaService: RespostaService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.turmaId = +this.route.snapshot.paramMap.get('id')!;
    this.isProfessor = this.authService.isProfessor(); 
    console.log('isProfessor (TurmaDetalhe):', this.isProfessor);
    this.carregarDados();
  }

  async carregarDados() {
    try {
      this.turma = await firstValueFrom(this.turmaService.buscarPorId(this.turmaId));
      this.atividades = await firstValueFrom(this.atividadeService.buscarPorTurma(this.turmaId));
      if (!this.isProfessor) {
        const alunoId = this.authService.obterUsuarioSessao()?.id || 0;
        for (const atividade of this.atividades) {
          try {
            await firstValueFrom(this.respostaService.obterResultados(alunoId, atividade.id!));
            this.jaRespondeu[atividade.id!] = true;
          } catch {
            this.jaRespondeu[atividade.id!] = false;
          }
        }
      }
      if (this.isProfessor) {
        const matriculas = await firstValueFrom(this.matriculaService.buscarPorTurma(this.turmaId));
        const alunosIds = matriculas.map(m => m.idAluno);
        if (alunosIds.length) {
          const alunosPromises = alunosIds.map(id => firstValueFrom(this.alunoService.buscarPorId(id)));
          this.alunos = await Promise.all(alunosPromises);
        }
      }
    } catch (error) {
      console.error(error);
      this.mostrarToast('Erro ao carregar dados da turma');
    }
  }

  compartilharCodigo() {
    if (this.turma?.codigoAcesso) {
      navigator.clipboard.writeText(this.turma.codigoAcesso);
      this.mostrarToast('Código copiado!');
    }
  }

  async salvarTurma() {
    if (this.turma) {
      await firstValueFrom(this.turmaService.atualizar(this.turma.id!, this.turma));
      this.mostrarToast('Turma atualizada');
    }
  }

  async excluirTurma() {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Turma',
      message: 'Tem certeza? Todas as atividades e respostas serão perdidas.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: async () => {
            await firstValueFrom(this.turmaService.excluir(this.turmaId));
            this.mostrarToast('Turma excluída');
            this.navCtrl.navigateRoot('/menu/minhas-turmas');
          }
        }
      ]
    });
    alert.present();
  }

  async editarAtividade(atividade: AtividadeModel) {
  const modal = await this.modalCtrl.create({
    component: EditarAtividadeComponent,
    componentProps: { atividade: { ...atividade } } // passamos uma cópia
  });
  modal.onDidDismiss().then(result => {
    if (result.data?.success) {
      this.carregarDados(); // recarregar lista
    }
  });
  await modal.present();
}

async excluirAtividade(id: number) {
  const alert = await this.alertCtrl.create({
    header: 'Excluir Atividade',
    message: 'Tem certeza? Todas as questões e respostas serão perdidas.',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Excluir',
        handler: async () => {
          try {
            await firstValueFrom(this.atividadeService.excluir(id));
            this.mostrarToast('Atividade excluída');
            this.carregarDados();
          } catch (error) {
            this.mostrarToast('Erro ao excluir atividade');
          }
        }
      }
    ]
  });
  alert.present();
}

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }
}