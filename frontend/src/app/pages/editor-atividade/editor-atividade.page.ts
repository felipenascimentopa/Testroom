import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon,
  IonRange, IonToggle, IonList, IonItem, IonLabel, IonLoading, IonSegment,
  IonSegmentButton, IonReorderGroup, IonReorder, IonItemGroup, IonBadge
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBack, downloadOutline, saveOutline, refreshOutline, addOutline,
  removeOutline, eyeOutline, keyOutline, gitCommitOutline, documentOutline,
  imageOutline
} from 'ionicons/icons';
import { AtividadeService } from '../../services/atividade.service';
import { PdfOptions, PDF_OPTIONS_PADRAO } from '../../model/pdf-options.model';

const STORAGE_KEY = 'pdf_options_preferidas';

interface QuestaoEditor {
  questaoAtividadeId: number;
  questaoId: number;
  enunciado: string;
  foto?: string;
  valorPontos: number;
  alternativas: { id: number; texto: string; verdadeira: boolean }[];
  quebraPaginaAntes: boolean;
  editandoEnunciado: boolean;
}

@Component({
  selector: 'app-editor-atividade',
  templateUrl: './editor-atividade.page.html',
  styleUrls: ['./editor-atividade.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon,
    IonRange, IonToggle, IonList, IonItem, IonLabel, IonLoading, IonSegment,
    IonSegmentButton, IonReorderGroup, IonReorder, IonItemGroup, IonBadge
  ]
})
export class EditorAtividadePage implements OnInit {
  atividadeId!: number;
  titulo = '';
  descricao = '';
  instrucoes = '';
  dataGeracao = '';
  valorTotal = 0;

  questoes: QuestaoEditor[] = [];
  options: PdfOptions = { ...PDF_OPTIONS_PADRAO };
  tipo: 'prova' | 'gabarito' = 'prova';
  zoom = 1;
  salvando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atividadeService: AtividadeService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      arrowBack, downloadOutline, saveOutline, refreshOutline, addOutline,
      removeOutline, eyeOutline, keyOutline, gitCommitOutline, documentOutline, imageOutline
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/atividades']); return; }
    this.atividadeId = +id;

    const salvas = localStorage.getItem(STORAGE_KEY);
    if (salvas) {
      try { this.options = { ...PDF_OPTIONS_PADRAO, ...JSON.parse(salvas) }; }
      catch { /* ignora */ }
    }

    this.carregar();
  }

  protected readonly Math = Math;
  letra(i: number): string {
    return String.fromCharCode(65 + i);
  }
  alternativaCorreta(q: QuestaoEditor, index: number): boolean {
    return !!q.alternativas[index]?.verdadeira;
  }

  async carregar() {
    const loading = await this.loadingCtrl.create({ message: 'Carregando...' });
    await loading.present();
    this.atividadeService.buscarPorId(this.atividadeId).subscribe({
      next: (a: any) => {
        this.titulo = a.titulo;
        this.descricao = a.descricao ?? '';
        this.instrucoes = a.instrucoes ?? '';
        this.dataGeracao = a.dataGeracao;
        this.valorTotal = a.valorPontos;
        this.questoes = (a.questoes || []).map((q: any) => ({
          questaoAtividadeId: q.questaoAtividadeId ?? q.id ?? q.questaoId,
          questaoId: q.questaoId,
          enunciado: q.enunciado,
          foto: q.foto,
          valorPontos: q.valorPontos,
          alternativas: (q.alternativas || []).map((alt: any) => ({ id: alt.id, texto: alt.texto, verdadeira: !!alt.verdadeira })),
          quebraPaginaAntes: !!q.quebraPaginaAntes,
          editandoEnunciado: false
        }));

        if (a.pdfOptionsJson) {
          try { this.options = { ...this.options, ...JSON.parse(a.pdfOptionsJson) }; }
          catch { /* ignora */ }
        }

        loading.dismiss();
      },
      error: async () => {
        loading.dismiss();
        this.toast('Falha ao carregar.', 'danger');
      }
    });
  }


  reordenar(ev: any) {
    ev.detail.complete();
    const de = ev.detail.from;
    const para = ev.detail.to;
    if (de !== para) {
      const [item] = this.questoes.splice(de, 1);
      this.questoes.splice(para, 0, item);
    }
  }

  toggleQuebra(q: QuestaoEditor) {
    q.quebraPaginaAntes = !q.quebraPaginaAntes;
  }

  editarInline(q: QuestaoEditor) {
    q.editandoEnunciado = true;
  }

  finalizarEdicao(q: QuestaoEditor, novoTexto: string) {
    q.editandoEnunciado = false;
    const t = novoTexto.trim();
    if (t && t !== q.enunciado) {
      q.enunciado = t;
    }
  }

  alterarOptions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.options));
  }

  resetarOpcoes() {
    this.options = { ...PDF_OPTIONS_PADRAO };
    this.alterarOptions();
  }


  async salvarLayout(mostrarToast = true) {
    this.salvando = true;
    const ordem = this.questoes.map((q, idx) => ({
      questaoAtividadeId: q.questaoAtividadeId,
      posicao: idx + 1,
      quebraPaginaAntes: q.quebraPaginaAntes
    }));

    this.atividadeService.salvarLayout(this.atividadeId, {
      ordem,
      pdfOptionsJson: JSON.stringify(this.options)
    }).subscribe({
      next: async () => {
        this.salvando = false;
        if (mostrarToast) this.toast('Layout salvo!', 'success');
      },
      error: async () => {
        this.salvando = false;
        this.toast('Falha ao salvar layout.', 'danger');
      }
    });
  }

  async baixarPdf() {
    await this.salvarLayout(false);
    const loading = await this.loadingCtrl.create({ message: 'Gerando PDF...' });
    await loading.present();

    const obs = this.tipo === 'gabarito'
      ? this.atividadeService.exportarGabarito(this.atividadeId, this.options)
      : this.atividadeService.exportarPdf(this.atividadeId, this.options);

    obs.subscribe({
      next: (blob) => {
        loading.dismiss();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.tipo}_${this.atividadeId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: async () => { loading.dismiss(); this.toast('Falha ao gerar PDF.', 'danger'); }
    });
  }

  private async toast(msg: string, color = 'danger') {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    await t.present();
  }

  get totalPaginasAproximado(): number {
    const margem = this.options.margemPagina * 1.33;
    const alturaUtil = 1123 - margem * 2;
    let usado = 0, paginas = 1;
    for (const q of this.questoes) {
      const altF = this.options.tamanhoFonteAlternativa * 1.4;
      const enfF = this.options.tamanhoFonteEnunciado * 1.4;
      let qAlt = enfF * 2 + 20;
      qAlt += q.alternativas.length * altF;
      if (q.foto) qAlt += 160;
      qAlt += this.options.espacamentoEntreQuestoes * 1.33;

      if (q.quebraPaginaAntes && usado > 0) { paginas++; usado = 0; }
      if (usado + qAlt > alturaUtil) { paginas++; usado = qAlt; }
      else usado += qAlt;
    }
    return paginas;
  }

  voltar() { this.router.navigate(['/atividades']); }
}