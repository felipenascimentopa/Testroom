import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonButtons, IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/autenticacao.service';
import { addIcons } from 'ionicons';
import {
  folderOutline,
  helpCircleOutline,
  personOutline,
  documentTextOutline,
  accessibilityOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonButtons, IonIcon,
    CommonModule, FormsModule
  ]
})
export class MenuPage {
  constructor(private authService: AuthService, private router: Router) {
    addIcons({
      folderOutline,
      helpCircleOutline,
      personOutline,
      documentTextOutline,
      accessibilityOutline
    });
  }

  irParaCategorias() {
    this.router.navigate(['/categorias']);
  }

  irParaQuestoes() {
    this.router.navigate(['/questoes']);
  }

  irParaGerarAtividade() {
    this.router.navigate(['/gerar-atividade']);
  }

  irParaAtividades() {                    
    this.router.navigate(['/atividades']);
  }

  irParaAcessibilidade() {
    this.router.navigate(['/acessibilidade']);
  }

  irParaPerfil() {
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}