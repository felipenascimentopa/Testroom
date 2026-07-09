import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { QuestaoBancoService } from '../../services/questao-banco.service';
import { AuthService } from '../../services/auth.service';
import { CategoriaModel } from '../../model/categoria.model';
import { AlternativaBancoModel } from '../../model/alternativa-banco.model';
import { QuestaoBancoModel } from '../../model/questao-banco.model';
import { TipoPergunta } from '../../model/questao.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-adicionar-editar-questao-banco',
  templateUrl: './adicionar-editar-questao-banco.component.html',
  styleUrls: ['./adicionar-editar-questao-banco.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class AdicionarEditarQuestaoBancoComponent implements OnInit {
  @Input() categorias: CategoriaModel[] = [];
  @Input() questaoEdicao?: QuestaoBancoModel;

  formGroup: FormGroup;
  alternativas: AlternativaBancoModel[] = [];
  mostrarGabarito = false;
  mostrarAlternativas = false;
  tiposDisponiveis = [
    { value: 'DISSERTATIVA' as TipoPergunta, label: 'Dissertativa' },
    { value: 'NUMERICA' as TipoPergunta, label: 'Numérica' },
    { value: 'VF' as TipoPergunta, label: 'Verdadeiro ou Falso' },
    { value: 'UNICA_ESCOLHA' as TipoPergunta, label: 'Única Escolha' },
    { value: 'MULTIPLA_ESCOLHA' as TipoPergunta, label: 'Múltipla Escolha' }
  ];

  constructor(
    private fb: FormBuilder,
    private questaoBancoService: QuestaoBancoService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    this.formGroup = this.fb.group({
      idCategoria: [null, Validators.required],
      tipoPergunta: ['DISSERTATIVA', Validators.required],
      enunciado: ['', Validators.required],
      peso: [1.0, [Validators.required, Validators.min(0.1)]],
      gabaritoTexto: [''],
      feedbackCorreto: [''],
      feedbackErrado: ['']
    });
  }

  ngOnInit() {
    if (this.questaoEdicao) {
      this.formGroup.patchValue(this.questaoEdicao);
      // Carregar alternativas se houver
    }
    this.onTipoChange({ detail: { value: this.formGroup.get('tipoPergunta')?.value } });
  }

  onTipoChange(event: any) {
    const tipo = event.detail.value as TipoPergunta;
    this.mostrarGabarito = tipo === 'DISSERTATIVA' || tipo === 'NUMERICA';
    this.mostrarAlternativas = ['VF', 'UNICA_ESCOLHA', 'MULTIPLA_ESCOLHA'].includes(tipo);
    if (this.mostrarAlternativas && this.alternativas.length === 0) {
      this.adicionarAlternativa();
    }
  }

  adicionarAlternativa() {
    this.alternativas.push({ texto: '', correta: false, ordem: this.alternativas.length, idQuestaoBanco: this.questaoEdicao?.id || 0 } as AlternativaBancoModel);
  }

  removerAlternativa(index: number) {
    this.alternativas.splice(index, 1);
  }

  async salvarQuestao() {
    if (this.formGroup.invalid) {
      this.mostrarToast('Preencha todos os campos obrigatórios.');
      return;
    }

    const questaoData: QuestaoBancoModel = {
      ...this.formGroup.value,
      idProfessor: this.authService.obterUsuarioSessao()?.id || 0
    };

    try {
      let questaoSalva: QuestaoBancoModel;
      if (this.questaoEdicao) {
        questaoSalva = await firstValueFrom(this.questaoBancoService.atualizar(this.questaoEdicao.id!, questaoData));
      } else {
        questaoSalva = await firstValueFrom(this.questaoBancoService.criar(questaoData));
        for (let i = 0; i < this.alternativas.length; i++) {
          const alt = { ...this.alternativas[i], idQuestaoBanco: questaoSalva.id!, ordem: i };
        }
      }
      this.modalCtrl.dismiss({ success: true });
    } catch (error) {
      console.error(error);
      this.mostrarToast('Erro ao salvar questão');
    }
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }

  fechar() {
    this.modalCtrl.dismiss();
  }
}