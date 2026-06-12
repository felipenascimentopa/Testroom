import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, 
  IonItem, IonInput, IonLabel, IonSelect, IonSelectOption,
  IonRadioGroup, IonRadio, IonText, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { NavController, ToastController } from '@ionic/angular';
import { AlunoService } from '../../services/aluno.service';
import { ProfessorService } from '../../services/professor.service';
import { AlunoModel } from '../../model/aluno.model';
import { ProfessorModel } from '../../model/professor.model';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton,
    IonItem, IonInput, IonLabel, IonSelect, IonSelectOption,
    IonRadioGroup, IonRadio, IonText, IonButtons, IonBackButton
  ]
})
export class CadastroPage {
  formGroup: FormGroup;
  tipoUsuario: 'ALUNO' | 'PROFESSOR' = 'ALUNO';

  constructor(
    private fb: FormBuilder,
    private alunoService: AlunoService,
    private professorService: ProfessorService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    this.formGroup = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      especialidade: ['']
    });
  }

  async cadastrar() {
    if (this.formGroup.invalid) {
      this.mostrarToast('Preencha todos os campos corretamente');
      return;
    }

    const dados = this.formGroup.value;
    try {
      if (this.tipoUsuario === 'ALUNO') {
        const aluno: AlunoModel = {
          id: 0,                    // id = 0 indica novo registro
          nome: dados.nome,
          email: dados.email,
          senha: dados.senha
        };
        await this.alunoService.salvar(aluno).toPromise();
        this.mostrarToast('Aluno cadastrado com sucesso! Faça login.');
      } else {
        const professor: ProfessorModel = {
          id: 0,                    // id = 0 indica novo registro
          nome: dados.nome,
          email: dados.email,
          senha: dados.senha,
          especialidade: dados.especialidade || ''
        };
        await this.professorService.salvar(professor).toPromise();
        this.mostrarToast('Professor cadastrado com sucesso! Faça login.');
      }
      this.navCtrl.navigateRoot('/login');
    } catch (error) {
      console.error(error);
      this.mostrarToast('Erro ao cadastrar. E-mail pode já estar em uso.');
    }
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }
}