import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonItem, IonInput, IonLabel } from '@ionic/angular/standalone';

import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
     selector: 'app-add-usuario',
     templateUrl: './add-usuario.page.html',
     styleUrls: ['./add-usuario.page.scss'],
     standalone: true,
     imports: [IonLabel, IonItem, IonInput, IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddUsuarioPage implements OnInit {

     usuario: UsuarioModel;
     formGroup: FormGroup;
     loginExistente: boolean = false;

     constructor(private formBuilder: FormBuilder, private toastController: ToastController, private navController: NavController, private usuarioService: UsuarioService) {
          this.usuario = new UsuarioModel();
          this.formGroup = this.formBuilder.group({
               'email': [this.usuario.email, Validators.compose([Validators.required])],
               'senha': [this.usuario.senha, Validators.compose([Validators.required])],
               'nome': [this.usuario.nome, Validators.compose([Validators.required])]
          });
     }

     ngOnInit() {
     }

     salvar() {
          this.usuario.nome = this.formGroup.value.nome;
          this.usuario.email = this.formGroup.value.email;
          this.usuario.senha = this.formGroup.value.senha;
          this.usuarioService.salvar(this.usuario);
          this.exibirMensagem('Registro salvo com sucesso!!!');
          this.navController.navigateBack('/login');
     }

     verificarLogin() {
          let email = this.formGroup.get('email')?.value;

          if (this.usuarioService.verificarEmail(email)) {
               this.loginExistente = true;
               this.exibirMensagem('Login já existe');
          } else {
               this.loginExistente = false;
          }
     }

     async exibirMensagem(texto: string) {
          const toast = await this.toastController.create({
               message: texto,
               duration: 1500
          });
          toast.present()
     }

}
