import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { MatriculaService } from '../../services/matricula.service';
import { AuthService } from '../../services/auth.service';
import { TurmaService } from '../../services/turma.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-entrar-turma',
  templateUrl: './entrar-turma.page.html',
  styleUrls: ['./entrar-turma.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class EntrarTurmaPage {
  codigoAcesso = '';

  constructor(
    private matriculaService: MatriculaService,
    private turmaService: TurmaService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  async entrarTurma() {
    if (!this.codigoAcesso) return;

    try {
      const turmas = await firstValueFrom(this.turmaService.buscarPorCodigo(this.codigoAcesso));
      if (!turmas || turmas.length === 0) {
        this.mostrarToast('Código inválido');
        return;
      }
      const turma = turmas[0];
      const alunoId = this.authService.obterUsuarioSessao()?.id || 0;

      await firstValueFrom(this.matriculaService.inscreverAluno(alunoId, turma.id!));
      
      this.mostrarToast('Matriculado com sucesso!');
      this.navCtrl.navigateRoot('/menu/minhas-turmas');
    } catch (error) {
      console.error(error);
      this.mostrarToast('Erro ao se matricular. Talvez você já esteja matriculado ou código inválido.');
    }
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }
}