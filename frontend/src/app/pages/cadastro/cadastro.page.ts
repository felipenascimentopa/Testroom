import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonLoading, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonLoading, IonButtons, IonIcon, CommonModule, FormsModule]
})
export class CadastroPage {
  usuario = { email: '', senha: '', cargo: 'PROFESSOR' };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    addIcons({ arrowBack });
  }

  async cadastrar() {
    const loading = await this.loadingCtrl.create({ message: 'Cadastrando...' });
    await loading.present();

    this.usuarioService.criar(this.usuario).subscribe({
      next: () => {
        loading.dismiss();
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: err.error?.message || 'Falha no cadastro.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  voltar() {
    this.router.navigate(['/login']);
  }
}