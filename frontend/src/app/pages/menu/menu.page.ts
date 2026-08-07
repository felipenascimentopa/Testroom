import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/autenticacao.service';
import { addIcons } from 'ionicons';
import { person } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, CommonModule, FormsModule]
})
export class MenuPage {
  constructor(private authService: AuthService, private router: Router) {
    addIcons({ person });
  }

  irParaCategorias() {
    this.router.navigate(['/categorias']);
  }

  irParaQuestoes() {
    this.router.navigate(['/questoes']);
  }

  irParaPerfil() {
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}