import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
  IonIcon, IonLoading
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AtividadeService } from '../../services/atividade.service';
import { AtividadeResumo } from '../../model/atividade.model';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBack, downloadOutline, keyOutline, trashOutline, eyeOutline, add
} from 'ionicons/icons';

interface GrupoAtividade {
  grupoId: string | null;
  versoes: AtividadeResumo[];
}

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.page.html',
  styleUrls: ['./atividades.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
    IonIcon, IonLoading
  ]
})
export class AtividadesPage implements OnInit {
  grupos: GrupoAtividade[] = [];
  novoGrupoId: string | null = null;

  constructor(
    private atividadeService: AtividadeService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({ arrowBack, downloadOutline, keyOutline, trashOutline, eyeOutline, add });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.novoGrupoId = params['novo'] || null;
      this.carregar();
    });
  }

  async carregar() {
    const loading = await this.loadingCtrl.create({ message: 'Carregando...' });
    await loading.present();
    this.atividadeService.listar().subscribe({
      next: (lista) => {
        this.grupos = this.agrupar(lista);
        loading.dismiss();
        if (this.novoGrupoId) {
          setTimeout(() => this.destacarNovoGrupo(), 300);
        }
      },
      error: async () => {
        loading.dismiss();
        await this.toast('Falha ao carregar atividades.', 'danger');
      }
    });
  }

  private agrupar(lista: AtividadeResumo[]): GrupoAtividade[] {
    const mapa = new Map<string, GrupoAtividade>();
    for (const a of lista) {
      const key = a.grupoId || `single-${a.id}`;
      if (!mapa.has(key)) {
        mapa.set(key, { grupoId: a.grupoId ?? null, versoes: [] });
      }
      mapa.get(key)!.versoes.push(a);
    }
    for (const g of mapa.values()) {
      g.versoes.sort((x, y) => x.id - y.id);
    }
    return Array.from(mapa.values());
  }

  private destacarNovoGrupo() {
    const el = document.getElementById('grupo-' + this.novoGrupoId);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.add('novo-destaque');

    setTimeout(() => el.classList.remove('novo-destaque'), 4000);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
  }

  getTituloGrupo(g: GrupoAtividade): string {
    const base = g.versoes[0]?.titulo?.replace(/\s*\(Versão \d+\)\s*$/, '') ?? 'Atividade';
    return base;
  }

  visualizar(a: AtividadeResumo) {
    this.router.navigate(['/visualizar-atividade', a.id]);
  }

  async baixarPdf(a: AtividadeResumo) {
    const loading = await this.loadingCtrl.create({ message: 'Gerando PDF...' });
    await loading.present();
    this.atividadeService.exportarPdf(a.id).subscribe({
      next: (blob) => {
        loading.dismiss();
        this.download(blob, `atividade_${a.id}.pdf`);
      },
      error: async () => {
        loading.dismiss();
        await this.toast('Falha ao gerar PDF.', 'danger');
      }
    });
  }

  async baixarGabarito(a: AtividadeResumo) {
    const loading = await this.loadingCtrl.create({ message: 'Gerando gabarito...' });
    await loading.present();
    this.atividadeService.exportarGabarito(a.id).subscribe({
      next: (blob) => {
        loading.dismiss();
        this.download(blob, `gabarito_${a.id}.pdf`);
      },
      error: async () => {
        loading.dismiss();
        await this.toast('Falha ao gerar gabarito.', 'danger');
      }
    });
  }

  private download(blob: Blob, nome: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nome;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async excluirGrupo(g: GrupoAtividade) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir atividade',
      message: `Excluir ${g.versoes.length} versão(ões) desta atividade?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Excluir', role: 'destructive', handler: () => this.confirmarExclusao(g) }
      ]
    });
    await alert.present();
  }

  private async confirmarExclusao(g: GrupoAtividade) {
    const loading = await this.loadingCtrl.create({ message: 'Excluindo...' });
    await loading.present();
    try {
      for (const v of g.versoes) {
        await this.atividadeService.excluir(v.id).toPromise();
      }
      loading.dismiss();
      this.carregar();
    } catch {
      loading.dismiss();
      await this.toast('Erro ao excluir.', 'danger');
    }
  }

  private async toast(msg: string, color: string = 'danger') {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    await t.present();
  }

  adicionar() {
    this.router.navigate(['/gerar-atividade']);
  }

  voltar() {
    this.router.navigate(['/menu']);
  }
}