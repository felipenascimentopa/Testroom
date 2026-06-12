import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { TurmaService } from '../../services/turma.service';
import { AuthService } from '../../services/auth.service';
import { TurmaModel } from '../../model/turma.model';

@Component({
  selector: 'app-criar-turma',
  templateUrl: './criar-turma.page.html',
  styleUrls: ['./criar-turma.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class CriarTurmaPage {
  formGroup: FormGroup;
  turmaCriada: TurmaModel | null = null;

  constructor(
    private fb: FormBuilder,
    private turmaService: TurmaService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    this.formGroup = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['']
    });
  }

  criar() {
    const novaTurma: TurmaModel = {
      ...this.formGroup.value,
      idProfessor: this.authService.obterUsuarioSessao()?.id
    };
    this.turmaService.salvar(novaTurma).subscribe({
      next: (turma) => {
        this.turmaCriada = turma;
        this.formGroup.reset();
      },
      error: () => this.mostrarToast('Erro ao criar turma')
    });
  }

  copiarCodigo() {
    navigator.clipboard.writeText(this.turmaCriada!.codigoAcesso!);
    this.mostrarToast('Código copiado!');
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }
}