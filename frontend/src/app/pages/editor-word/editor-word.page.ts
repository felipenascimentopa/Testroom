import {
  Component, ElementRef, OnDestroy, OnInit, ViewChild
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
  listOutline, listCircleOutline, removeOutline, trashOutline, refreshOutline,
  reorderTwoOutline, reorderThreeOutline, reorderFourOutline,
  returnDownBackOutline, returnDownForwardOutline, keyOutline
} from 'ionicons/icons';
import { AtividadeService } from '../../services/atividade.service';
import { pickImageFile, fileToBase64Resized } from '../../utils/imagem.util';

const TAMANHOS_FONTE = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36];

// Medidas da folha A4 em pixels CSS (mesmas do @page do PDF: margem 15mm)
const MM = 96 / 25.4;
const PAGE_H = 297 * MM;
const MARGEM = 15 * MM;
const AREA_UTIL = PAGE_H - 2 * MARGEM;

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
export class EditorWordPage implements OnInit, OnDestroy {
  @ViewChild('editor', { static: false }) editorRef!: ElementRef<HTMLDivElement>;
  @ViewChild('workspace', { static: false }) workspaceRef!: ElementRef<HTMLDivElement>;

  atividadeId!: number;
  atividade: any = null;
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
  frame = { left: 0, top: 0, width: 0, height: 0 };
  larguraPct = 0;

  private paginarTimer: any = null;
  private loadListenerOk = false;
  private resize = { ativo: false, startX: 0, startW: 0, parentW: 1 };

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
      listOutline, listCircleOutline, removeOutline, trashOutline, refreshOutline,
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

  ngOnDestroy() {
    if (this.paginarTimer) clearTimeout(this.paginarTimer);
  }

  private async carregar() {
    const loading = await this.loadingCtrl.create({ message: 'Carregando...' });
    await loading.present();

    this.atividadeService.buscarPorId(this.atividadeId).subscribe({
      next: (a: any) => {
        this.atividade = a;
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
    const ed = this.editorRef?.nativeElement;
    if (!ed) return;
    ed.innerHTML = html;
    this.imagemSelecionada = null;

    // Quando uma imagem termina de carregar a altura muda -> repagina
    if (!this.loadListenerOk) {
      ed.addEventListener('load', () => this.agendarPaginacao(), true);
      this.loadListenerOk = true;
    }
    this.agendarPaginacao(30);
  }

  // =========================================================
  // Paginação visual (mesmas medidas do PDF)
  // =========================================================

  aoEditar() {
    this.agendarPaginacao(150);
  }

  private agendarPaginacao(ms = 100) {
    if (this.paginarTimer) clearTimeout(this.paginarTimer);
    this.paginarTimer = setTimeout(() => {
      this.paginar();
      this.atualizarFrame();
    }, ms);
  }

  /**
   * Empurra para a página seguinte todo bloco de primeiro nível que não cabe
   * no que sobrou da página atual, inserindo um espaçador (.pg-spacer).
   * Os espaçadores nunca são salvos nem vão para o PDF.
   */
  private paginar() {
    const ed = this.editorRef?.nativeElement;
    if (!ed) return;

    ed.querySelectorAll('.pg-spacer').forEach(e => e.remove());
    ed.style.minHeight = '';

    const filhos = Array.from(ed.children) as HTMLElement[];
    for (const el of filhos) {
      const h = el.offsetHeight;
      if (h === 0 || h > AREA_UTIL) continue; // bloco maior que uma página: deixa quebrar

      const top = el.offsetTop;
      const pagina = Math.floor(top / PAGE_H);
      const limite = pagina * PAGE_H + PAGE_H - MARGEM;

      if (top + h > limite + 0.5) {
        const alvo = (pagina + 1) * PAGE_H + MARGEM;
        const sp = document.createElement('div');
        sp.className = 'pg-spacer';
        sp.setAttribute('contenteditable', 'false');
        const h0 = Math.max(0, alvo - top);
        sp.style.height = h0 + 'px';
        el.before(sp);

        // corrige diferença causada por colapso de margens
        const diff = alvo - el.offsetTop;
        if (Math.abs(diff) > 0.5) {
          sp.style.height = Math.max(0, h0 + diff) + 'px';
        }
      }
    }

    // Altura total = número inteiro de páginas
    let fundo = 0;
    for (const el of Array.from(ed.children) as HTMLElement[]) {
      if (el.classList.contains('pg-spacer')) continue;
      fundo = Math.max(fundo, el.offsetTop + el.offsetHeight);
    }
    const paginas = Math.max(1, Math.ceil((fundo + MARGEM - 0.5) / PAGE_H));
    ed.style.minHeight = (paginas * PAGE_H) + 'px';
  }

  // =========================================================
  // Comandos de formatação
  // =========================================================

  manterFoco(e: MouseEvent) { e.preventDefault(); }

  cmd(comando: string, valor?: string) {
    document.execCommand(comando, false, valor);
    this.editorRef.nativeElement.focus();
    this.agendarPaginacao();
  }

  formatBlock(tag: string) {
    document.execCommand('formatBlock', false, tag);
    this.editorRef.nativeElement.focus();
    this.agendarPaginacao();
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
    this.agendarPaginacao();
  }

  async inserirImagem() {
    const file = await pickImageFile();
    if (!file) return;
    const base64 = await fileToBase64Resized(file, 1400, 0.9);
    this.editorRef.nativeElement.focus();
    document.execCommand('insertImage', false, base64);
    this.agendarPaginacao();
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
    this.agendarPaginacao();
  }

  limparFormatacao() {
    document.execCommand('removeFormat');
    this.editorRef.nativeElement.focus();
  }

  // =========================================================
  // Imagem: seleção, resize por arraste, botões e alinhamento
  // =========================================================

  onEditorClick(e: MouseEvent) {
    const t = e.target as HTMLElement;
    if (t && t.tagName === 'IMG') {
      const img = t as HTMLImageElement;
      this.garantirBloco(img);
      this.imagemSelecionada = img;
      this.atualizarFrame();
    } else {
      this.imagemSelecionada = null;
    }
  }

  /** Garante que a imagem esteja dentro de um bloco (p) para poder alinhar/redimensionar em %. */
  private garantirBloco(img: HTMLImageElement): HTMLElement {
    const ed = this.editorRef.nativeElement;
    if (img.parentElement === ed) {
      const p = document.createElement('p');
      img.replaceWith(p);
      p.appendChild(img);
      return p;
    }
    return img.parentElement as HTMLElement;
  }

  private atualizarFrame() {
    const img = this.imagemSelecionada;
    const ed = this.editorRef?.nativeElement;
    const ws = this.workspaceRef?.nativeElement;
    if (!img || !ws || !ed) return;

    if (!ed.contains(img)) {
      this.imagemSelecionada = null;
      return;
    }

    const r = img.getBoundingClientRect();
    const w = ws.getBoundingClientRect();
    this.frame = {
      left: r.left - w.left + ws.scrollLeft,
      top: r.top - w.top + ws.scrollTop,
      width: r.width,
      height: r.height
    };

    const parentW = this.larguraPai(img);
    this.larguraPct = Math.max(1, Math.min(100, Math.round((r.width / parentW) * 100)));
  }

  private larguraPai(img: HTMLImageElement): number {
    const p = img.parentElement;
    const w = p ? p.clientWidth : 0;
    return w > 0 ? w : 1;
  }

  iniciarResize(ev: PointerEvent) {
    if (!this.imagemSelecionada) return;
    ev.preventDefault();
    ev.stopPropagation();
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
    this.resize = {
      ativo: true,
      startX: ev.clientX,
      startW: this.imagemSelecionada.getBoundingClientRect().width,
      parentW: this.larguraPai(this.imagemSelecionada)
    };
  }

  moverResize(ev: PointerEvent) {
    if (!this.resize.ativo || !this.imagemSelecionada) return;
    const novaLargura = this.resize.startW + (ev.clientX - this.resize.startX);
    const pct = Math.max(5, Math.min(100, (novaLargura / this.resize.parentW) * 100));
    this.imagemSelecionada.style.width = pct.toFixed(1) + '%';
    this.imagemSelecionada.style.height = 'auto';
    this.atualizarFrame();
  }

  finalizarResize(ev: PointerEvent) {
    if (!this.resize.ativo) return;
    this.resize.ativo = false;
    try { (ev.target as HTMLElement).releasePointerCapture(ev.pointerId); } catch { /* ignore */ }
    this.agendarPaginacao(30);
  }

  redimensionarImagem(pct: number) {
    if (!this.imagemSelecionada) return;
    this.imagemSelecionada.style.width = pct + '%';
    this.imagemSelecionada.style.height = 'auto';
    this.atualizarFrame();
    this.agendarPaginacao(30);
  }

  alinharImagem(alinhamento: 'left' | 'center' | 'right') {
    if (!this.imagemSelecionada) return;
    const bloco = this.garantirBloco(this.imagemSelecionada);
    bloco.style.textAlign = alinhamento;
    this.atualizarFrame();
  }

  removerImagemSelecionada() {
    if (!this.imagemSelecionada) return;
    this.imagemSelecionada.remove();
    this.imagemSelecionada = null;
    this.agendarPaginacao(30);
  }

  // =========================================================
  // Prova / gabarito
  // =========================================================

  alternarTipo() {
    this.tipo = this.tipo === 'prova' ? 'gabarito' : 'prova';
    this.agendarPaginacao(30);
  }

  async regenerar() {
    if (!this.atividade) return;
    const alert = await this.alertCtrl.create({
      header: 'Regenerar conteúdo',
      message: 'Isso descarta as edições atuais e recria o documento a partir das questões da atividade. Continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Regenerar',
          role: 'destructive',
          handler: () => {
            this.setCorpoEditor(this.gerarCorpoInicial(this.atividade));
          }
        }
      ]
    });
    await alert.present();
  }

  // =========================================================
  // Salvar / PDF
  // =========================================================

  /** HTML do editor sem os espaçadores visuais de página. */
  private getCorpoAtual(): string {
    const ed = this.editorRef?.nativeElement;
    if (!ed) return '';
    const clone = ed.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.pg-spacer').forEach(e => e.remove());
    return clone.innerHTML;
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
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.45; color: #000; background: #fff; }
  p { margin: 0 0 6pt; }
  img { max-width: 100%; height: auto; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #666; padding: 4pt 6pt; }
  .so-gabarito { display: none; }
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
    return (s ?? '').replace(/[&<>"']/g, c => ({
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

      if (q.foto) {
        bloco += `<p style="text-align:center"><img src="${q.foto}" style="width:60%;height:auto" /></p>`;
      }

      const usaCaixinha =
        q.tipoQuestao === 'VERDADEIROFALSO' || q.tipoQuestao === 'MULTIPLA_ESCOLHA';

      const alts = (q.alternativas || []).map((alt: any, i: number) => {
        let marcador: string;
        let extra = '';

        if (usaCaixinha) {
          marcador = alt.verdadeira
            ? `<span class="so-prova">(&#160;&#160;)</span><span class="so-gabarito">(X)</span>`
            : `(&#160;&#160;)`;
        } else {
          marcador = `${String.fromCharCode(65 + i)})`;
          if (alt.verdadeira) extra = ' <span class="so-gabarito">(correta)</span>';
        }

        return `<p style="margin-left:14pt"><strong>${marcador}</strong> ${this.escaparHtml(alt.texto)}${extra}</p>`;
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