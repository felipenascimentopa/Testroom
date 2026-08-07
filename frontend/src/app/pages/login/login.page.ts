import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonLoading, IonAlert } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/autenticacao.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonLoading, IonAlert, CommonModule, FormsModule]
})
export class LoginPage {
  email: string = '';
  senha: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  async login() {
    const loading = await this.loadingCtrl.create({ message: 'Autenticando...' });
    await loading.present();

    this.authService.login(this.email, this.senha).subscribe({
      next: (usuario) => {
        loading.dismiss();
        this.authService.salvarUsuario(usuario);
        this.router.navigate(['/menu']);
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: err.error?.message || 'Falha no login. Verifique credenciais.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}