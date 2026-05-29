import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonMenuButton, IonList, IonItem, IonLabel, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonChip,
    IonIcon, IonFab, IonFabButton, IonToast
} from '@ionic/angular/standalone';
import { NavController, ToastController } from '@ionic/angular';
import { TurmaModel } from '../../model/turma.model';
import { TurmaService } from '../../services/turma.service';
import { AuthService } from '../../services/auth.service';
import { MatriculaService } from '../../services/matricula.service';

import { addIcons } from 'ionicons';
import { add, people, time, bookOutline } from 'ionicons/icons';

@Component({
    selector: 'app-minhas-turmas',
    templateUrl: './minhas-turmas.page.html',
    styleUrls: ['./minhas-turmas.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
        IonMenuButton, IonList, IonItem, IonLabel, IonCard,
        IonCardHeader, IonCardTitle, IonCardContent, IonChip,
        IonIcon, IonFab, IonFabButton, IonToast, CommonModule, RouterModule
    ]
})
export class MinhasTurmasPage {
    turmas: TurmaModel[] = [];
    loading: boolean = true;

    constructor(
        private turmaService: TurmaService,
        private authService: AuthService,
        private matriculaService: MatriculaService,
        private toastController: ToastController,
        private navController: NavController
    ) {
        addIcons({ add, people, time, bookOutline });
    }

    ionViewWillEnter() {
        this.carregarTurmas();
    }

    carregarTurmas() {
        this.loading = true;
        const usuario = this.authService.obterUsuarioSessao();

        if (this.authService.isProfessor() && usuario) {
            this.turmaService.buscarPorProfessor(usuario.id).subscribe({
                next: (res) => {
                    this.turmas = res;
                    this.loading = false;
                },
                error: () => {
                    this.exibirMensagem('Erro ao carregar turmas');
                    this.loading = false;
                }
            });
        } else if (this.authService.isAluno() && usuario) {
            this.matriculaService.buscarPorAluno(usuario.id).subscribe({
                next: (matriculas) => {
                    const turmasIds = matriculas.map(m => m.idTurma);
                    if (turmasIds.length > 0) {
                        this.turmaService.listarTodas().subscribe({
                            next: (todasTurmas) => {
                                this.turmas = todasTurmas.filter(t => turmasIds.includes(t.id));
                                this.loading = false;
                            },
                            error: () => {
                                this.exibirMensagem('Erro ao carregar turmas');
                                this.loading = false;
                            }
                        });
                    } else {
                        this.turmas = [];
                        this.loading = false;
                    }
                },
                error: () => {
                    this.exibirMensagem('Erro ao carregar matrículas');
                    this.loading = false;
                }
            });
        }
    }

    verTurma(turmaId: number) {
        this.navController.navigateForward(`/turma-detalhe/${turmaId}`);
    }

    async exibirMensagem(texto: string) {
        const toast = await this.toastController.create({
            message: texto,
            duration: 1500
        });
        toast.present();
    }
}