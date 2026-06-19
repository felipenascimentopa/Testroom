import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
    IonContent, IonHeader, IonToolbar, IonTitle, 
    IonMenu, IonButtons, IonList, IonItem, IonIcon, IonLabel,
    IonRouterOutlet    
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular'; // Serviços ficam aqui, NUNCA no imports do componente
import { AuthService } from '../../services/auth.service';

// Importação dos ícones para o template
import { addIcons } from 'ionicons';
import { 
    peopleOutline, schoolOutline, documentTextOutline, 
    logOutOutline, personOutline, clipboardOutline, 
    folderOutline, libraryOutline 
} from 'ionicons/icons';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
    standalone: true,
    imports: [
        // APENAS componentes visuais, pipes e módulos aqui!
        IonContent, IonHeader, IonToolbar, IonTitle, 
        IonMenu, IonButtons, IonList, IonItem, IonIcon, IonLabel,
        IonRouterOutlet, 
        CommonModule, RouterModule 
    ]
})
export class MenuPage {
    usuarioNome: string = '';
    tipoUsuario: string = '';

    constructor(
        private authService: AuthService,
        private navController: NavController
    ) {
        // Registra os ícones para uso no template HTML
        addIcons({ 
            peopleOutline, schoolOutline, documentTextOutline, 
            logOutOutline, personOutline, clipboardOutline, 
            folderOutline, libraryOutline 
        });
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