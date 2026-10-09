import {
  Component, ElementRef, HostListener, OnInit, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon,
  IonLoading, IonToast
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController, LoadingController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack, saveOutline, eyeOutline, imageOutline, linkOutline,
  listOutline, listCircleOutline, removeOutline,
  reorderTwoOutline, reorderThreeOutline, reorderFourOutline,
  returnDownBackOutline, returnDownForwardOutline, keyOutline
} from 'ionicons/icons';
import { AtividadeService } from '../../services/atividade.service';
import { pickImageFile, fileToBase64Resized } from '../../utils/imagem.util';

const TAMANHOS_FONTE = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36];

@Component({
  selector: 'app-editor-word',
  templateUrl: './editor-word.page.html',
  styleUrls: ['./editor-word.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon,
    IonLoading, IonToast
  ]
})
export class EditorWordPage implements OnInit {
  @ViewChild('editor', { static: false }) editorRef!: ElementRef<HTMLDivElement>;

  atividadeId!: number;
  titulo = '';
  tipo: 'prova' | 'gabarito' = 'prova';
  salvando = false;
  toastMsg = '';
  toastAberto = false;

  corTexto = '#000000';
  corFundo = '#ffff00';
  fontSizeAtual = 12;
  readonly tamanhosFonte = TAMANHOS_FONTE;

  imagemSelecionada: HTMLImageElement | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atividadeService: AtividadeService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      arrowBack, saveOutline, eyeOutline, imageOutline, linkOutline,
      listOutline, listCircleOutline, removeOutline,
      reorderTwoOutline, reorderThreeOutline, reorderFourOutline,
      returnDownBackOutline, returnDownForwardOutline, keyOutline
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/atividades']); return; }
    this.atividadeId = +id;

    if (this.route.snapshot.queryParamMap.get('tipo') === 'gabarito') {
      this.tipo = 'gabarito';
    }

    this.carregar();
  }

  private async carregar() {
    const loading = await this.loadingCtrl.create({ message: 'Carregando...' });
    await loading.present();

    this.atividadeService.buscarPorId(this.atividadeId).subscribe({
      next: (a: any) => {
        this.titulo = a.titulo;
        this.atividadeService.buscarHtml(this.atividadeId).subscribe({
          next: (dto) => {
            const corpo = dto?.html ? this.extrairCorpo(dto.html) : this.gerarCorpoInicial(a);
            setTimeout(() => this.setCorpoEditor(corpo), 0);
            loading.dismiss();
          },
          error: () => {
            setTimeout(() => this.setCorpoEditor(this.gerarCorpoInicial(a)), 0);
            loading.dismiss();
          }
        });
      },
      error: async () => {
        loading.dismiss();
        this.toast('Falha ao carregar atividade.', 'danger');
      }
    });
  }

  private setCorpoEditor(html: string) {
    if (this.editorRef?.nativeElement) {
      this.editorRef.nativeElement.innerHTML = html;
    }
  }

  manterFoco(e: MouseEvent) { e.preventDefault(); }

  cmd(comando: string, valor?: string) {
    document.execCommand(comando, false, valor);
    this.editorRef.nativeElement.focus();
  }

  formatBlock(tag: string) {
    document.execCommand('formatBlock', false, tag);
    this.editorRef.nativeElement.focus();
  }

  aplicarCorTexto(cor: string) {
    this.corTexto = cor;
    document.execCommand('foreColor', false, cor);
    this.editorRef.nativeElement.focus();
  }

  aplicarCorFundo(cor: string) {
    this.corFundo = cor;
    document.execCommand('hiliteColor', false, cor);
    this.editorRef.nativeElement.focus();
  }

  aplicarFontSize(pt: number) {
    this.fontSizeAtual = pt;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      return;
    }
    document.execCommand('fontSize', false, '7');
    const editor = this.editorRef.nativeElement;
    editor.querySelectorAll('font[size="7"]').forEach((el) => {
      const span = document.createElement('span');
      span.setAttribute('style', `font-size: ${pt}pt`);
      span.innerHTML = (el as HTMLElement).innerHTML;
      el.replaceWith(span);
    });
    this.editorRef.nativeElement.focus();
  }

  async inserirImagem() {
    const file = await pickImageFile();
    if (!file) return;
    const base64 = await fileToBase64Resized(file, 1400, 0.9);
    document.execCommand('insertImage', false, base64);
    this.editorRef.nativeElement.focus();
  }

  async inserirLink() {
    const alert = await this.alertCtrl.create({
      header: 'Inserir link',
      inputs: [{ name: 'url', type: 'url', placeholder: 'https://...' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Inserir',
          handler: (d) => {
            const url = (d.url || '').trim();
            if (!url) return false;
            document.execCommand('createLink', false, url);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  inserirTabela() {
    const html = `
      <table>
        <thead><tr><th>Cabeçalho 1</th><th>Cabeçalho 2</th></tr></thead>
        <tbody>
          <tr><td>&#160;</td><td>&#160;</td></tr>
          <tr><td>&#160;</td><td>&#160;</td></tr>
        </tbody>
      </table><p><br/></p>`;
    document.execCommand('insertHTML', false, html);
    this.editorRef.nativeElement.focus();
  }

  limparFormatacao() {
    document.execCommand('removeFormat');
    this.editorRef.nativeElement.focus();
  }

  onEditorClick(e: MouseEvent) {
    const t = e.target as HTMLElement;
    if (t && t.tagName === 'IMG') {
      this.imagemSelecionada = t as HTMLImageElement;
    } else {
      this.imagemSelecionada = null;
    }
  }

  redimensionarImagem(pct: number) {
    if (!this.imagemSelecionada) return;
    this.imagemSelecionada.style.width = pct + '%';
    this.imagemSelecionada.style.height = 'auto';
    this.editorRef.nativeElement.focus();
  }

  removerImagemSelecionada() {
    if (!this.imagemSelecionada) return;
    this.imagemSelecionada.remove();
    this.imagemSelecionada = null;
  }

  alternarTipo() {
    this.tipo = this.tipo === 'prova' ? 'gabarito' : 'prova';
  }

  private getCorpoAtual(): string {
    return this.editorRef?.nativeElement?.innerHTML ?? '';
  }

  private extrairCorpo(htmlCompleto: string): string {
    try {
      const doc = new DOMParser().parseFromString(htmlCompleto, 'text/html');
      const pagina = doc.querySelector('.pagina');
      if (pagina) return pagina.innerHTML;
      return doc.body?.innerHTML ?? htmlCompleto;
    } catch {
      return htmlCompleto;
    }
  }

  private montarDocumentoCompleto(corpo: string): string {
    return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>${this.escaparHtml(this.titulo)}</title>
<style>
  @page { size: A4; margin: 15mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11pt;
    line-height: 1.45;
    color: #000;
    background: #fff;
  }
  h1 { font-size: 20pt; margin: 0 0 10pt; }
  h2 { font-size: 16pt; margin: 12pt 0 6pt; }
  h3 { font-size: 13pt; margin: 10pt 0 4pt; }
  h4 { font-size: 12pt; margin: 8pt 0 4pt; }
  p { margin: 0 0 6pt; }
  ul, ol { margin: 0 0 6pt; padding-left: 22pt; }
  blockquote { margin: 8pt 0; padding: 4pt 10pt; border-left: 3px solid #999; color: #444; }
  img { max-width: 100%; height: auto; }
  table { border-collapse: collapse; width: 100%; margin: 6pt 0; }
  th, td { border: 1px solid #666; padding: 4pt 6pt; vertical-align: top; }
  hr { border: none; border-top: 1px solid #bbb; margin: 10pt 0; }

  /* Marcador de alternativa correta: visível só no modo gabarito */
  .pagina:not(.gabarito) .alt-correta { display: none !important; }
  .pagina.gabarito .alt-correta {
    display: inline !important;
    color: #0a7d2e;
    font-weight: 700;
  }

  @media screen {
    body { background: #e5e5e5; padding: 20px; }
    .pagina {
      width: 210mm; min-height: 297mm;
      padding: 15mm;
      background: #fff;
      margin: 0 auto;
      box-shadow: 0 4px 20px rgba(0,0,0,.18);
    }
  }
  @media print {
    body { background: #fff; padding: 0; }
    .pagina { width: auto; min-height: 0; padding: 0; margin: 0; box-shadow: none; background: #fff; }
  }
</style>
</head>
<body>
<div class="pagina">
${corpo}
</div>
</body>
</html>`;
  }

  private escaparHtml(s: string): string {
    return s.replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c] as string));
  }

  async salvar(mostrarToast = true) {
    this.salvando = true;
    const corpo = this.getCorpoAtual();
    const html = this.montarDocumentoCompleto(corpo);

    this.atividadeService.salvarHtml(this.atividadeId, html).subscribe({
      next: async () => {
        this.salvando = false;
        if (mostrarToast) this.toast('Salvo!', 'success');
      },
      error: async () => {
        this.salvando = false;
        this.toast('Falha ao salvar.', 'danger');
      }
    });
  }

  async previewPdf() {
    await this.salvar(false);

    const loading = await this.loadingCtrl.create({ message: 'Gerando PDF...' });
    await loading.present();

    this.atividadeService.baixarPdfHtml(this.atividadeId, this.tipo).subscribe({
      next: (blob) => {
        loading.dismiss();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      },
      error: async () => {
        loading.dismiss();
        this.toast('Falha ao gerar PDF.', 'danger');
      }
    });
  }

  private gerarCorpoInicial(a: any): string {
    const linhas: string[] = [];
    linhas.push(`<h1>${this.escaparHtml(a.titulo || '')}</h1>`);
    if (a.descricao) linhas.push(`<p><em>${this.escaparHtml(a.descricao)}</em></p>`);
    if (a.instrucoes) linhas.push(`<p><strong>Instruções:</strong> ${this.escaparHtml(a.instrucoes)}</p>`);
    if (a.valorPontos != null) linhas.push(`<p><strong>Total:</strong> ${a.valorPontos} pts</p>`);
    linhas.push('<hr>');

    const questoes = (a.questoes || []).slice().sort((x: any, y: any) => x.posicao - y.posicao);
    for (const q of questoes) {
      let bloco = `<p><strong>${q.posicao}.</strong> ${this.escaparHtml(q.enunciado)}`
        + ` <span style="color:#666;font-size:0.85em">(${q.valorPontos} pts)</span></p>`;
      if (q.foto) bloco += `<p><img src="${q.foto}" /></p>`;

      const usaCaixinha =
        q.tipoQuestao === 'VERDADEIROFALSO' || q.tipoQuestao === 'MULTIPLA_ESCOLHA';

      const alts = (q.alternativas || []).map((alt: any, i: number) => {
        const marcador = usaCaixinha ? '(  )' : `${String.fromCharCode(65 + i)})`;
        const correta = alt.verdadeira
          ? ' <span class="alt-correta">← correta</span>'
          : '';
        return `<p style="margin-left:14pt"><strong>${marcador}</strong> ${this.escaparHtml(alt.texto)}${correta}</p>`;
      }).join('');
      bloco += alts;
      linhas.push(bloco);
    }
    return linhas.join('\n');
  }

  private async toast(msg: string, color = 'danger') {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    await t.present();
  }

  voltar() { this.router.navigate(['/atividades']); }
}