import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AtividadeService } from '../../services/atividade.service';
import { AtividadeModel } from '../../model/atividade.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-criar-atividade',
  templateUrl: './criar-atividade.page.html',
  styleUrls: ['./criar-atividade.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, RouterModule]
})
export class CriarAtividadePage implements OnInit {
  formGroup: FormGroup;
  turmaId: number = 0;

  constructor(
    private fb: FormBuilder,
    private atividadeService: AtividadeService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {
    this.formGroup = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      dtEntrega: [''],
      disponivel: [true]
    });
  }

  ngOnInit() {
    this.turmaId = +this.route.snapshot.paramMap.get('turmaId')!;
  }

  async salvarEIrParaQuestoes() {
    const novaAtividade: AtividadeModel = {
      ...this.formGroup.value,
      idTurma: this.turmaId
    };
    try {
      const salva = await firstValueFrom(this.atividadeService.salvar(novaAtividade));
      this.mostrarToast('Atividade criada! Agora adicione as questões.');
      this.navCtrl.navigateForward(`/menu/selecionar-questoes-banco/${salva.id}`);
    } catch (error) {
      this.mostrarToast('Erro ao criar atividade');
    }
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }
}