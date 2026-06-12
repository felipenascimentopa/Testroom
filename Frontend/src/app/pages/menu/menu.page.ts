import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
    IonContent, IonHeader, IonToolbar, IonTitle, 
    IonMenu, IonMenuButton, IonButtons, IonList, IonItem, IonIcon, IonLabel,
    IonButton, IonAlert, IonRouterOutlet    
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

import { addIcons } from 'ionicons';
import { 
    peopleOutline, schoolOutline, documentTextOutline, 
    logOutOutline, personOutline, clipboardOutline
} from 'ionicons/icons';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
    standalone: true,
    imports: [  // <-- LISTA COMPLETA E CORRETA
        IonContent, IonHeader, IonToolbar, IonTitle, 
        IonMenu, IonMenuButton, IonButtons, IonList, IonItem, IonIcon, IonLabel,
        IonButton, IonAlert, IonRouterOutlet,   // <-- ADICIONADO
        CommonModule, RouterModule
        // IonicModule NÃO DEVE estar aqui
    ]
})
export class MenuPage {
    usuarioNome: string = '';
    tipoUsuario: string = '';

    constructor(
        private authService: AuthService,
        private navController: NavController
    ) {
        addIcons({ peopleOutline, schoolOutline, documentTextOutline, logOutOutline, personOutline, clipboardOutline });
    }

    ionViewWillEnter() {
        const usuario = this.authService.obterUsuarioSessao();
        if (usuario) {
            this.usuarioNome = usuario.nome;
            this.tipoUsuario = usuario.tipoUsuario;
        }
    }

    isProfessor(): boolean {
        return this.authService.isProfessor();
    }

    isAluno(): boolean {
        return this.authService.isAluno();
    }

    logout() {
        this.authService.limparSessao();
        this.navController.navigateRoot('/login');
    }
}