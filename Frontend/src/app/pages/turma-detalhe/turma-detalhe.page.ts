import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonBackButton, IonList, IonItem, IonLabel, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonChip,
    IonIcon, IonFab, IonFabButton, IonButton, IonBadge
} from '@ionic/angular/standalone';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { TurmaModel } from '../../model/turma.model';
import { AtividadeModel } from '../../model/atividade.model';
import { MatriculaModel } from '../../model/matricula.model';
import { AlunoModel } from '../../model/aluno.model';
import { TurmaService } from '../../services/turma.service';
import { AtividadeService } from '../../services/atividade.service';
import { MatriculaService } from '../../services/matricula.service';
import { AlunoService } from '../../services/aluno.service';
import { AuthService } from '../../services/auth.service';

import { addIcons } from 'ionicons';
import { add, people, time, documentTextOutline, trash, create } from 'ionicons/icons';

@Component({
    selector: 'app-turma-detalhe',
    templateUrl: './turma-detalhe.page.html',
    styleUrls: ['./turma-detalhe.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
        IonBackButton, IonList, IonItem, IonLabel, IonCard,
        IonCardHeader, IonCardTitle, IonCardContent, IonChip,
        IonIcon, IonFab, IonFabButton, IonButton, IonBadge,
        CommonModule, RouterModule
    ]
})
export class TurmaDetalhePage {
    turmaId!: number;
    turma: TurmaModel | null = null;
    atividades: AtividadeModel[] = [];
    alunos: AlunoModel[] = [];
    loading: boolean = true;

    constructor(
        private activatedRoute: ActivatedRoute,
        private turmaService: TurmaService,
        private atividadeService: AtividadeService,
        private matriculaService: MatriculaService,
        private alunoService: AlunoService,
        private authService: AuthService,
        private toastController: ToastController,
        private alertController: AlertController,
        private navController: NavController
    ) {
        addIcons({ add, people, time, documentTextOutline, trash, create });
    }

    ionViewWillEnter() {
        this.turmaId = Number(this.activatedRoute.snapshot.params['id']);
        this.carregarDados();
    }

    carregarDados() {
        this.loading = true;
        this.turmaService.buscarPorId(this.turmaId).subscribe({
            next: (turma) => {
                this.turma = turma;
                this.carregarAtividades();
                if (this.isProfessor()) {
                    this.carregarAlunos();
                }
                this.loading = false;
            },
            error: () => {
                this.exibirMensagem('Erro ao carregar turma');
                this.loading = false;
            }
        });
    }

    carregarAtividades() {
        this.atividadeService.buscarPorTurma(this.turmaId).subscribe({
            next: (atividades) => {
                this.atividades = atividades;
            },
            error: () => {
                this.exibirMensagem('Erro ao carregar atividades');
            }
        });
    }

    carregarAlunos() {
        this.matriculaService.buscarPorTurma(this.turmaId).subscribe({
            next: (matriculas) => {
                const alunosIds = matriculas.map(m => m.idAluno);
                if (alunosIds.length > 0) {
                    this.alunoService.listarTodos().subscribe({
                        next: (todosAlunos) => {
                            this.alunos = todosAlunos.filter(a => alunosIds.includes(a.id));
                        },
                        error: () => {
                            this.exibirMensagem('Erro ao carregar alunos');
                        }
                    });
                } else {
                    this.alunos = [];
                }
            },
            error: () => {
                this.exibirMensagem('Erro ao carregar matrículas');
            }
        });
    }

    isProfessor(): boolean {
        return this.authService.isProfessor();
    }

    isAluno(): boolean {
        return this.authService.isAluno();
    }

    verAtividade(atividadeId: number) {
        this.navController.navigateForward(`/atividade-detalhe/${atividadeId}`);
    }

    novaAtividade() {
        this.navController.navigateForward(`/criar-atividade/${this.turmaId}`);
    }

    editarTurma() {
        this.navController.navigateForward(`/editar-turma/${this.turmaId}`);
    }

    async excluirTurma() {
        const alert = await this.alertController.create({
            header: 'Confirmar exclusão',
            message: `Deseja realmente excluir a turma "${this.turma?.nome}"?`,
            buttons: [
                { text: 'Cancelar' },
                {
                    text: 'Excluir',
                    cssClass: 'danger',
                    handler: () => {
                        if (this.turma) {
                            this.turmaService.excluir(this.turma.id).subscribe({
                                next: () => {
                                    this.exibirMensagem('Turma excluída com sucesso');
                                    this.navController.navigateBack('/minhas-turmas');
                                },
                                error: () => {
                                    this.exibirMensagem('Erro ao excluir turma');
                                }
                            });
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

    async exibirMensagem(texto: string) {
        const toast = await this.toastController.create({
            message: texto,
            duration: 1500
        });
        toast.present();
    }
}