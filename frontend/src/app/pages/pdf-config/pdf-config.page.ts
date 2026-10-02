import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
  IonIcon, IonList, IonItem, IonLabel, IonToggle, IonRange, IonSegment,
  IonSegmentButton, IonLoading, IonNote
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBack, eyeOutline, downloadOutline, refreshOutline, textOutline,
  resizeOutline, documentTextOutline, imageOutline
} from 'ionicons/icons';
import { AtividadeService } from '../../services/atividade.service';
import { PdfOptions, PDF_OPTIONS_PADRAO } from '../../model/pdf-options.model';

const STORAGE_KEY = 'pdf_options_preferidas';

@Component({
  selector: 'app-pdf-config',
  templateUrl: './pdf-config.page.html',
  styleUrls: ['./pdf-config.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
    IonIcon, IonList, IonItem, IonLabel, IonToggle, IonRange, IonSegment,
    IonSegmentButton, IonLoading, IonNote
  ]
})
export class PdfConfigPage implements OnInit {
  atividadeId!: number;
  tipo: 'prova' | 'gabarito' = 'prova';
  options: PdfOptions = { ...PDF_OPTIONS_PADRAO };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atividadeService: AtividadeService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      arrowBack, eyeOutline, downloadOutline, refreshOutline,
      textOutline, resizeOutline, documentTextOutline, imageOutline
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.atividadeId = +id;
    else this.router.navigate(['/atividades']);

    const tipoParam = this.route.snapshot.queryParamMap.get('tipo');
    if (tipoParam === 'gabarito') this.tipo = 'gabarito';

    const salvas = localStorage.getItem(STORAGE_KEY);
    if (salvas) {
      try { this.options = { ...PDF_OPTIONS_PADRAO, ...JSON.parse(salvas) }; }
      catch { /* ignore */ }
    }
  }

  private salvarPreferencias() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.options));
  }

  resetar() {
    this.options = { ...PDF_OPTIONS_PADRAO };
    this.salvarPreferencias();
  }

  private async baixarOuPreview(preview: boolean) {
    this.salvarPreferencias();

    const w = preview ? window.open('', '_blank') : null;

    const loading = await this.loadingCtrl.create({
      message: preview ? 'Gerando pré-visualização...' : 'Gerando PDF...'
    });
    await loading.present();

    const obs = this.tipo === 'gabarito'
      ? this.atividadeService.exportarGabarito(this.atividadeId, this.options)
      : this.atividadeService.exportarPdf(this.atividadeId, this.options);

    obs.subscribe({
      next: (blob) => {
        loading.dismiss();
        const url = URL.createObjectURL(blob);

        if (preview) {
          if (w) w.location.href = url;
          else window.open(url, '_blank');
          setTimeout(() => URL.revokeObjectURL(url), 120000);
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = `${this.tipo}_${this.atividadeId}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
          this.toast('PDF gerado!', 'success');
        }
      },
      error: async () => {
        loading.dismiss();
        if (w) w.close();
        this.toast('Falha ao gerar o PDF.', 'danger');
      }
    });
  }

  preview() { this.baixarOuPreview(true); }
  baixar()  { this.baixarOuPreview(false); }

  private async toast(msg: string, color = 'danger') {
    const t = await this.toastCtrl.create({ message: msg, duration: 2200, color });
    await t.present();
  }

  voltar() { this.router.navigate(['/atividades']); }
}