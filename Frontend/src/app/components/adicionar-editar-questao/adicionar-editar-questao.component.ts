import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { QuestaoService } from '../../services/questao.service';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';
import { CategoriaModel } from '../../model/categoria.model';
import { AlternativaModel } from '../../model/alternativa.model';
import { QuestaoModel, TipoPergunta } from '../../model/questao.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-adicionar-editar-questao',
  templateUrl: './adicionar-editar-questao.component.html',
  styleUrls: ['./adicionar-editar-questao.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class AdicionarEditarQuestaoComponent implements OnInit {
  @Input() atividadeId!: number;
  @Input() questaoEdicao?: QuestaoModel;

  formGroup: FormGroup;
  categorias: CategoriaModel[] = [];
  alternativas: AlternativaModel[] = [];
  mostrarGabarito = false;
  mostrarAlternativas = false;
  tiposDisponiveis: { value: TipoPergunta; label: string }[] = [
    { value: 'DISSERTATIVA', label: 'Dissertativa' },
    { value: 'NUMERICA', label: 'Numérica' },
    { value: 'VF', label: 'Verdadeiro ou Falso' },
    { value: 'UNICA_ESCOLHA', label: 'Única Escolha' },
    { value: 'MULTIPLA_ESCOLHA', label: 'Múltipla Escolha' }
  ];

  constructor(
    private fb: FormBuilder,
    private questaoService: QuestaoService,
    private categoriaService: CategoriaService,
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

  async ngOnInit() {
    const professorId = this.authService.obterUsuarioSessao()?.id || 0;
    this.categorias = await firstValueFrom(this.categoriaService.listarPorProfessor(professorId));

    if (this.questaoEdicao) {
      this.formGroup.patchValue(this.questaoEdicao);
      if (this.questaoEdicao.tipoPergunta !== 'DISSERTATIVA' && this.questaoEdicao.tipoPergunta !== 'NUMERICA') {
        this.alternativas = await firstValueFrom(this.questaoService.listarAlternativas(this.questaoEdicao.id!));
      }
      this.onTipoChange({ detail: { value: this.questaoEdicao.tipoPergunta } });
    } else {
      this.onTipoChange({ detail: { value: 'DISSERTATIVA' } });
    }
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
    this.alternativas.push({ texto: '', correta: false, ordem: this.alternativas.length, idQuestao: this.questaoEdicao?.id || 0 } as AlternativaModel);
  }

  removerAlternativa(index: number) {
    this.alternativas.splice(index, 1);
  }

  async salvarQuestao() {
    if (this.formGroup.invalid) {
      this.mostrarToast('Preencha todos os campos obrigatórios.');
      return;
    }

    const questaoData: QuestaoModel = {
      ...this.formGroup.value,
      idAtividade: this.atividadeId
    };

    try {
      let questaoSalva: QuestaoModel;
      if (this.questaoEdicao) {
        questaoSalva = await firstValueFrom(this.questaoService.atualizar(this.questaoEdicao.id!, questaoData));
        const alternativasAntigas = await firstValueFrom(this.questaoService.listarAlternativas(questaoSalva.id!));
        for (const alt of alternativasAntigas) {
          await firstValueFrom(this.questaoService.excluirAlternativa(alt.id!));
        }
        for (let i = 0; i < this.alternativas.length; i++) {
          const alt = { ...this.alternativas[i], idQuestao: questaoSalva.id!, ordem: i };
          await firstValueFrom(this.questaoService.criarAlternativa(alt));
        }
      } else {
        questaoSalva = await firstValueFrom(this.questaoService.criar(questaoData));
        for (let i = 0; i < this.alternativas.length; i++) {
          const alt = { ...this.alternativas[i], idQuestao: questaoSalva.id!, ordem: i };
          await firstValueFrom(this.questaoService.criarAlternativa(alt));
        }
      }
      this.modalCtrl.dismiss({ success: true, questao: questaoSalva });
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