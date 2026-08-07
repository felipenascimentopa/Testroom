import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonSelect, IonSelectOption, IonCheckbox, IonList, IonButtons, IonLoading, IonAlert, IonIcon, IonItemDivider } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestaoService } from '../../services/questao.service';
import { CategoriaService } from '../../services/categoria.service';
import { QuestaoModel, Alternativa } from '../../model/questao.model';
import { TipoQuestao } from '../../model/tipo-questao.enum';
import { CategoriaModel } from '../../model/categoria.model';
import { AlertController, LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-questao-form',
  templateUrl: './questao-form.page.html',
  styleUrls: ['./questao-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonSelect, IonSelectOption, IonCheckbox, IonList, IonButtons, IonLoading, IonAlert, IonIcon, IonItemDivider, CommonModule, FormsModule]
})
export class QuestaoFormPage implements OnInit {
  questao: QuestaoModel = {
    tipoQuestao: TipoQuestao.UNICA_ESCOLHA,
    enunciado: '',
    valorPontos: 1.0,
    categoriaIds: [],
    alternativas: []
  };
  isEdit = false;
  id?: number;
  categorias: CategoriaModel[] = [];
  tiposQuestao = Object.values(TipoQuestao);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questaoService: QuestaoService,
    private categoriaService: CategoriaService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ close });
  }

  ngOnInit() {
    this.carregarCategorias();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.id = +idParam;
      this.carregarQuestao(this.id);
    }
  }

  async carregarCategorias() {
    this.categoriaService.listar().subscribe({
      next: (data) => this.categorias = data,
      error: () => {}
    });
  }

  async carregarQuestao(id: number) {
    const loading = await this.loadingCtrl.create({ message: 'Carregando...' });
    await loading.present();
    this.questaoService.buscarPorId(id).subscribe({
      next: (data) => {
        this.questao = data;
        if (!this.questao.categoriaIds) this.questao.categoriaIds = [];
        if (!this.questao.alternativas) this.questao.alternativas = [];
        if (this.questao.categorias) {
          this.questao.categoriaIds = this.questao.categorias.map(c => c.id);
        }
        loading.dismiss();
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Falha ao carregar questão.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  adicionarAlternativa() {
    this.questao.alternativas.push({ texto: '', verdadeira: false });
  }

  removerAlternativa(index: number) {
    this.questao.alternativas.splice(index, 1);
  }

  async salvar() {
    if (!this.questao.categoriaIds || this.questao.categoriaIds.length === 0) {
      const alert = await this.alertCtrl.create({
        header: 'Atenção',
        message: 'Selecione pelo menos uma categoria.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.questao.alternativas.length < 2) {
      const alert = await this.alertCtrl.create({
        header: 'Atenção',
        message: 'Adicione pelo menos duas alternativas.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.questao.tipoQuestao === TipoQuestao.UNICA_ESCOLHA) {
      const verdadeiras = this.questao.alternativas.filter(a => a.verdadeira).length;
      if (verdadeiras !== 1) {
        const alert = await this.alertCtrl.create({
          header: 'Atenção',
          message: 'Para questão de única escolha, deve haver exatamente uma alternativa verdadeira.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
    }

    const loading = await this.loadingCtrl.create({ message: 'Salvando...' });
    await loading.present();

    const payload = {
      tipoQuestao: this.questao.tipoQuestao,
      enunciado: this.questao.enunciado,
      valorPontos: this.questao.valorPontos,
      categoriaIds: this.questao.categoriaIds,
      alternativas: this.questao.alternativas
    };

    const obs = this.isEdit
      ? this.questaoService.atualizar(this.id!, payload as any)
      : this.questaoService.criar(payload as any);

    obs.subscribe({
      next: () => {
        loading.dismiss();
        this.router.navigate(['/questoes']);
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: err.error?.message || 'Falha ao salvar questão.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  voltar() {
    this.router.navigate(['/questoes']);
  }
}