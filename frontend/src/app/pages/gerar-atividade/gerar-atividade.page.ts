import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, 
  IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, 
  IonSelectOption, IonList, IonListHeader, IonCheckbox, IonLoading, IonAlert
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AtividadeService } from '../../services/atividade.service';
import { CategoriaService } from '../../services/categoria.service';
import { QuestaoService } from '../../services/questao.service';
import { AtividadeComQuestoesRequest, QuestaoSelecionada } from '../../model/atividade-com-questao.model';
import { CategoriaModel } from '../../model/categoria.model';
import { QuestaoModel } from '../../model/questao.model';
import { AlertController, LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-gerar-atividade',
  templateUrl: './gerar-atividade.page.html',
  styleUrls: ['./gerar-atividade.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonList,
    IonListHeader,
    IonCheckbox,
    IonLoading,
    IonAlert
  ]
})
export class GerarAtividadePage implements OnInit {
  atividade: AtividadeComQuestoesRequest = {
    titulo: '',
    descricao: '',
    instrucoes: '',
    questoes: [],
    quantidadeVersoes: 1
  };
  categorias: CategoriaModel[] = [];
  filtroCategoria: number | null = null;
  questoesDisponiveis: (QuestaoModel & { selecionada: boolean; valorAtribuido: number })[] = [];
  questoesSelecionadas: QuestaoSelecionada[] = [];

  constructor(
    private atividadeService: AtividadeService,
    private categoriaService: CategoriaService,
    private questaoService: QuestaoService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    this.carregarCategorias();
    this.carregarQuestoes();
  }

  carregarCategorias() {
    this.categoriaService.listar().subscribe(data => this.categorias = data);
  }

  carregarQuestoes() {
    const obs = this.filtroCategoria
      ? this.questaoService.listarPorCategoria(this.filtroCategoria)
      : this.questaoService.listar();
    obs.subscribe(data => {
      this.questoesDisponiveis = data.map(q => ({
        ...q,
        selecionada: false,
        valorAtribuido: 1.0
      }));
    });
  }

  atualizarSelecao(q: any) {
    if (q.selecionada) {
      this.questoesSelecionadas.push({
        questaoId: q.id!,
        valorPontos: q.valorAtribuido
      });
    } else {
      // Remove
      this.questoesSelecionadas = this.questoesSelecionadas.filter(
        item => item.questaoId !== q.id
      );
    }
  }

  async criar() {
    if (this.questoesSelecionadas.length === 0) {
      const alert = await this.alertCtrl.create({
        header: 'Atenção',
        message: 'Selecione pelo menos uma questão.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.questoesSelecionadas = this.questoesDisponiveis
      .filter(q => q.selecionada)
      .map(q => ({
        questaoId: q.id!,
        valorPontos: q.valorAtribuido
      }));

    const payload: AtividadeComQuestoesRequest = {
      titulo: this.atividade.titulo,
      descricao: this.atividade.descricao,
      instrucoes: this.atividade.instrucoes,
      questoes: this.questoesSelecionadas,
      quantidadeVersoes: this.atividade.quantidadeVersoes
    };

    const loading = await this.loadingCtrl.create({ message: 'Criando atividade...' });
    await loading.present();

    this.atividadeService.criarComQuestoes(payload).subscribe({
      next: (versoes) => {
        loading.dismiss();
        if (versoes && versoes.length > 0) {
          this.router.navigate(['/visualizar-atividade', versoes[0].id]);
        } else {
          this.router.navigate(['/menu']);
        }
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: err.error?.message || 'Falha ao criar atividade.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  voltar() {
    this.router.navigate(['/menu']);
  }
}