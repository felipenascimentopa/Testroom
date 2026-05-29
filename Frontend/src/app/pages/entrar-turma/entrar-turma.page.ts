import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonBackButton, IonItem, IonLabel, IonInput, IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';
import { ToastController, NavController } from '@ionic/angular';
import { TurmaService } from '../../services/turma.service';
import { MatriculaService } from '../../services/matricula.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-entrar-turma',
    templateUrl: './entrar-turma.page.html',
    styleUrls: ['./entrar-turma.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
        IonBackButton, IonItem, IonLabel, IonInput, IonButton,
        IonCard, IonCardHeader, IonCardTitle, IonCardContent,
        CommonModule, FormsModule, ReactiveFormsModule, RouterModule
    ]
})
export class EntrarTurmaPage {
    formGroup: FormGroup;
    codigoAcesso: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private toastController: ToastController,
        private navController: NavController,
        private turmaService: TurmaService,
        private matriculaService: MatriculaService,
        private authService: AuthService
    ) {
        this.formGroup = this.formBuilder.group({
            'codigoAcesso': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });
    }

    entrar() {
        const codigo = this.formGroup.value.codigoAcesso;
        
        this.turmaService.listarTodas().subscribe({
            next: (turmas) => {
                const turma = turmas.find(t => t.codigoAcesso === codigo);
                
                if (!turma) {
                    this.exibirMensagem('Código de acesso inválido!');
                    return;
                }

                const usuario = this.authService.obterUsuarioSessao();
                if (usuario && this.authService.isAluno()) {
                    // Verificar se já está matriculado
                    this.matriculaService.buscarPorAluno(usuario.id).subscribe({
                        next: (matriculas) => {
                            const jaMatriculado = matriculas.some(m => m.idTurma === turma.id);
                            
                            if (jaMatriculado) {
                                this.exibirMensagem('Você já está matriculado nesta turma!');
                                return;
                            }

                            // Realizar matrícula
                            this.matriculaService.matricular({
                                id: 0,
                                idAluno: usuario.id,
                                idTurma: turma.id,
                                dataMatricula: new Date().toISOString(),
                                ativo: true
                            }).subscribe({
                                next: () => {
                                    this.exibirMensagem('Matriculado com sucesso!');
                                    this.navController.navigateBack('/menu/minhas-turmas');
                                },
                                error: () => {
                                    this.exibirMensagem('Erro ao realizar matrícula');
                                }
                            });
                        },
                        error: () => {
                            this.exibirMensagem('Erro ao verificar matrícula');
                        }
                    });
                }
            },
            error: () => {
                this.exibirMensagem('Erro ao verificar código');
            }
        });
    }

    async exibirMensagem(texto: string) {
        const toast = await this.toastController.create({
            message: texto,
            duration: 1500
        });
        toast.present();
    }
}