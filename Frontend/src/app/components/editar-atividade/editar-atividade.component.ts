import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { AtividadeModel } from '../../model/atividade.model';
import { AtividadeService } from '../../services/atividade.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-editar-atividade',
  templateUrl: './editar-atividade.component.html',
  styleUrls: ['./editar-atividade.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class EditarAtividadeComponent {
  @Input() atividade!: AtividadeModel;

  constructor(
    private modalCtrl: ModalController,
    private atividadeService: AtividadeService,
    private toastCtrl: ToastController
  ) {}

  async salvar() {
    try {
      await firstValueFrom(this.atividadeService.salvar(this.atividade));
      this.mostrarToast('Atividade atualizada!');
      this.modalCtrl.dismiss({ success: true });
    } catch (error) {
      this.mostrarToast('Erro ao atualizar atividade.');
    }
  }

  fechar() {
    this.modalCtrl.dismiss();
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }
}