import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButton, IonButtons, IonIcon, IonLoading, IonAlert
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AtividadeService } from '../../services/atividade.service';
import { AtividadeResponse } from '../../model/atividade.model';
import { AlertController, LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack, downloadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-visualizar-atividade',
  templateUrl: './visualizar-atividade.page.html',
  styleUrls: ['./visualizar-atividade.page.scss'],
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
    IonLoading,
    IonAlert
  ]
})
export class VisualizarAtividadePage implements OnInit {
  atividadeId!: number;
  atividade: AtividadeResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atividadeService: AtividadeService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    addIcons({ arrowBack, downloadOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.atividadeId = +id;
      this.carregarAtividade();
    } else {
      this.router.navigate(['/menu']);
    }
  }

  async carregarAtividade() {
    const loading = await this.loadingCtrl.create({ message: 'Carregando atividade...' });
    await loading.present();

    this.atividadeService.buscarPorId(this.atividadeId).subscribe({
      next: (data) => {
        this.atividade = data;
        loading.dismiss();
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Falha ao carregar atividade.',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/menu']);
      }
    });
  }

  async baixarPdf() {
    if (!this.atividadeId) return;
    const loading = await this.loadingCtrl.create({ message: 'Gerando PDF...' });
    await loading.present();

    this.atividadeService.exportarPdf(this.atividadeId).subscribe({
      next: (blob) => {
        loading.dismiss();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `atividade_${this.atividadeId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Falha ao gerar PDF.',
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