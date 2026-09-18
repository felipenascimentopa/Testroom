import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
  IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSelect,
  IonSelectOption, IonList, IonCheckbox, IonLoading, IonAlert
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
import { arrowBack, funnelOutline, helpCircleOutline } from 'ionicons/icons';

type QuestaoDisponivel = QuestaoModel & { selecionada: boolean; valorAtribuido: number };

@Component({
  selector: 'app-gerar-atividade',
  templateUrl: './gerar-atividade.page.html',
  styleUrls: ['./gerar-atividade.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
    IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSelect,
    IonSelectOption, IonList, IonCheckbox, IonLoading, IonAlert
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
  filtroCategorias: number[] = [];
  questoesDisponiveis: QuestaoDisponivel[] = [];
  questoesSelecionadas: QuestaoSelecionada[] = [];
  totalPontos = 0;

  constructor(
    private atividadeService: AtividadeService,
    private categoriaService: CategoriaService,
    private questaoService: QuestaoService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ arrowBack, funnelOutline, helpCircleOutline });
  }

  ngOnInit() {
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.categoriaService.listar().subscribe(data => this.categorias = data);
  }

  carregarQuestoes() {
    if (!this.filtroCategorias || this.filtroCategorias.length === 0) {
      this.questoesDisponiveis = [];
      this.questoesSelecionadas = [];
      this.recalcularTotal();
      return;
    }

    this.questaoService.listarPorCategorias(this.filtroCategorias).subscribe(data => {
      this.questoesDisponiveis = data.map(q => ({
        ...q,
        selecionada: false,
        valorAtribuido: 1.0
      }));
      this.questoesSelecionadas = [];
      this.recalcularTotal();
    });
  }

  get temFiltroSelecionado(): boolean {
    return this.filtroCategorias != null && this.filtroCategorias.length > 0;
  }

  atualizarSelecao(q: QuestaoDisponivel) {
    if (q.selecionada) {
      const existente = this.questoesSelecionadas.find(s => s.questaoId === q.id);
      if (!existente) {
        this.questoesSelecionadas.push({
          questaoId: q.id!,
          valorPontos: Number(q.valorAtribuido) || 1
        });
      }
    } else {
      this.questoesSelecionadas = this.questoesSelecionadas.filter(
        item => item.questaoId !== q.id
      );
    }
    this.recalcularTotal();
  }

  sanitizarPontos(q: QuestaoDisponivel) {
    const n = Number(q.valorAtribuido);
    if (!isFinite(n) || n <= 0) {
      q.valorAtribuido = 1.0;
    } else {
      q.valorAtribuido = Math.round(n * 100) / 100;
    }
    const sel = this.questoesSelecionadas.find(s => s.questaoId === q.id);
    if (sel) {
      sel.valorPontos = q.valorAtribuido;
    }
    this.recalcularTotal();
  }

  recalcularTotal() {
    this.totalPontos = this.questoesSelecionadas.reduce(
      (acc, s) => acc + (Number(s.valorPontos) || 0), 0
    );
  }

  formatarTipo(tipo: string): string {
    switch (tipo) {
      case 'UNICA_ESCOLHA': return 'Única escolha';
      case 'MULTIPLA_ESCOLHA': return 'Múltipla escolha';
      case 'VERDADEIROFALSO': return 'Verdadeiro ou falso';
      default: return tipo;
    }
  }

  async criar() {
    if (!this.atividade.titulo?.trim()) {
      await this.aviso('Informe um título para a atividade.');
      return;
    }

    const selecionadas = this.questoesDisponiveis
      .filter(q => q.selecionada)
      .map(q => {
        const pontos = Number(q.valorAtribuido);
        return {
          questaoId: q.id!,
          valorPontos: isFinite(pontos) && pontos > 0 ? Math.round(pontos * 100) / 100 : 1.0
        };
      });

    if (selecionadas.length === 0) {
      await this.aviso('Selecione pelo menos uma questão.');
      return;
    }

    const payload: AtividadeComQuestoesRequest = {
      titulo: this.atividade.titulo,
      descricao: this.atividade.descricao,
      instrucoes: this.atividade.instrucoes,
      questoes: selecionadas,
      quantidadeVersoes: this.atividade.quantidadeVersoes || 1
    };

    const loading = await this.loadingCtrl.create({ message: 'Criando atividade...' });
    await loading.present();

    this.atividadeService.criarComQuestoes(payload).subscribe({
      next: (versoes) => {
        loading.dismiss();
        const grupoId = versoes?.[0]?.grupoId;
        this.router.navigate(['/atividades'], {
          queryParams: grupoId ? { novo: grupoId } : {}
        });
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

  private async aviso(mensagem: string) {
    const alert = await this.alertCtrl.create({
      header: 'Atenção',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  voltar() {
    this.router.navigate(['/menu']);
  }
}