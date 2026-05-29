import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
    IonBackButton, IonItem, IonLabel, IonInput, IonTextarea,
    IonButton, IonLoading
} from '@ionic/angular/standalone';
import { ToastController, NavController } from '@ionic/angular';
import { TurmaModel } from '../../model/turma.model';
import { TurmaService } from '../../services/turma.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-criar-turma',
    templateUrl: './criar-turma.page.html',
    styleUrls: ['./criar-turma.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
        IonBackButton, IonItem, IonLabel, IonInput, IonTextarea,
        IonButton, IonLoading, CommonModule, FormsModule, ReactiveFormsModule, RouterModule
    ]
})
export class CriarTurmaPage implements OnInit {
    formGroup: FormGroup;
    turma: TurmaModel;
    isEditing: boolean = false;
    turmaId: number | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private toastController: ToastController,
        private navController: NavController,
        private turmaService: TurmaService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute
    ) {
        this.turma = new TurmaModel();
        this.formGroup = this.formBuilder.group({
            'nome': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            'descricao': ['', Validators.required],
            'codigoAcesso': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });
    }

    ngOnInit() {
        this.turmaId = this.activatedRoute.snapshot.params['id'];
        if (this.turmaId) {
            this.isEditing = true;
            this.carregarTurma();
        }
    }

    carregarTurma() {
        if (this.turmaId) {
            this.turmaService.buscarPorId(this.turmaId).subscribe({
                next: (res) => {
                    this.turma = res;
                    this.formGroup.patchValue({
                        nome: res.nome,
                        descricao: res.descricao,
                        codigoAcesso: res.codigoAcesso
                    });
                },
                error: () => {
                    this.exibirMensagem('Erro ao carregar turma');
                }
            });
        }
    }

    salvar() {
        this.turma.nome = this.formGroup.value.nome;
        this.turma.descricao = this.formGroup.value.descricao;
        this.turma.codigoAcesso = this.formGroup.value.codigoAcesso;

        const usuario = this.authService.obterUsuarioSessao();
        if (usuario && this.authService.isProfessor()) {
            this.turma.idProfessor = usuario.id;
        }

        this.turmaService.salvar(this.turma).subscribe({
            next: () => {
                this.exibirMensagem(this.isEditing ? 'Turma atualizada com sucesso!' : 'Turma criada com sucesso!');
                this.navController.navigateBack('/menu/minhas-turmas');
            },
            error: (erro) => {
                console.error(erro);
                this.exibirMensagem('Erro ao salvar turma');
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