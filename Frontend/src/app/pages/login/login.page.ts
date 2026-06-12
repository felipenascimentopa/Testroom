import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
    IonContent, IonHeader, IonToolbar, IonButton, IonItem, 
    IonInput, IonLabel, IonTitle, IonButtons, IonBackButton,
    IonIcon                           // <-- ADICIONE IonIcon
} from '@ionic/angular/standalone';
import { ToastController, NavController } from '@ionic/angular'; // serviços
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

// Importe os ícones que você vai usar (opcional, mas boa prática)
import { addIcons } from 'ionicons';
import { schoolOutline, mailOutline, lockClosedOutline, arrowForwardOutline } from 'ionicons/icons';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        IonContent, IonHeader, IonToolbar, IonButton, IonItem,
        IonInput, IonLabel, IonTitle, IonButtons, IonBackButton,
        IonIcon,                             // <-- ADICIONE AQUI
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule
    ]
})
export class LoginPage {
    formGroup: FormGroup;
    email: string;
    senha: string;

    constructor(
        private formBuilder: FormBuilder,
        private toastController: ToastController,
        private navController: NavController,
        private authService: AuthService
    ) {
        // Registra os ícones para uso no template
        addIcons({ schoolOutline, mailOutline, lockClosedOutline, arrowForwardOutline });

        this.email = "";
        this.senha = "";

        this.formGroup = this.formBuilder.group({
            'email': [this.email, Validators.compose([Validators.required, Validators.email])],
            'senha': [this.senha, Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }

    ngOnInit() {
        this.authService.limparSessao();
    }
    
    irParaCadastro() {
        this.navController.navigateForward('/cadastro');
    }

    autenticar() {
        const credenciais = {
            email: this.formGroup.value.email,
            senha: this.formGroup.value.senha
        };

        this.authService.login(credenciais).subscribe({
            next: (resultado) => {
                this.authService.salvarSessao(resultado);
                this.navController.navigateRoot('/menu');
            },
            error: () => {
                this.exibirMensagem('Email ou senha incorretos.');
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