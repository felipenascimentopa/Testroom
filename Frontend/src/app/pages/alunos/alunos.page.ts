import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonMenuButton, IonList, IonItem, IonLabel, IonAvatar,
    IonIcon, IonFab, IonFabButton, IonSearchbar, IonChip,
    IonItemSliding, IonItemOptions, IonItemOption, IonAlert
} from '@ionic/angular/standalone';
import { ToastController, AlertController, NavController } from '@ionic/angular';
import { AlunoModel } from '../../model/aluno.model';
import { AlunoService } from '../../services/aluno.service';

import { addIcons } from 'ionicons';
import { add, person, trash, create } from 'ionicons/icons';

@Component({
    selector: 'app-alunos',
    templateUrl: './alunos.page.html',
    styleUrls: ['./alunos.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
        IonMenuButton, IonList, IonItem, IonLabel, IonAvatar,
        IonIcon, IonFab, IonFabButton, IonSearchbar, IonChip,
        IonItemSliding, IonItemOptions, IonItemOption, IonAlert,
        CommonModule, RouterModule, FormsModule
    ]
})
export class AlunosPage {
    alunos: AlunoModel[] = [];
    alunosFiltrados: AlunoModel[] = [];
    searchTerm: string = '';

    constructor(
        private alunoService: AlunoService,
        private toastController: ToastController,
        private alertController: AlertController,
        private navController: NavController
    ) {
        addIcons({ add, person, trash, create });
    }

    ionViewWillEnter() {
        this.carregarAlunos();
    }

    carregarAlunos() {
        this.alunoService.listarTodos().subscribe({
            next: (res) => {
                this.alunos = res;
                this.alunosFiltrados = res;
            },
            error: () => {
                this.exibirMensagem('Erro ao carregar alunos');
            }
        });
    }

    filtrarAlunos() {
        if (this.searchTerm.trim() === '') {
            this.alunosFiltrados = this.alunos;
        } else {
            const term = this.searchTerm.toLowerCase();
            this.alunosFiltrados = this.alunos.filter(aluno => 
                aluno.nome.toLowerCase().includes(term) || 
                aluno.email.toLowerCase().includes(term)
            );
        }
    }

    editarAluno(aluno: AlunoModel) {
        this.navController.navigateForward(`/criar-aluno/${aluno.id}`);
    }

    async excluirAluno(aluno: AlunoModel) {
        const alert = await this.alertController.create({
            header: 'Confirmar exclusão',
            message: `Deseja realmente excluir o aluno "${aluno.nome}"?`,
            buttons: [
                { text: 'Cancelar' },
                {
                    text: 'Excluir',
                    cssClass: 'danger',
                    handler: () => {
                        this.alunoService.excluir(aluno.id).subscribe({
                            next: () => {
                                this.exibirMensagem('Aluno excluído com sucesso');
                                this.carregarAlunos();
                            },
                            error: () => {
                                this.exibirMensagem('Erro ao excluir aluno');
                            }
                        });
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