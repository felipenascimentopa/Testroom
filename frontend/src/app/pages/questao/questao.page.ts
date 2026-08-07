import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonButtons, IonIcon, IonAlert, IonLoading } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestaoService } from '../../services/questao.service';
import { QuestaoModel } from '../../model/questao.model';
import { AlertController, LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { pencil, trash, arrowBack, add } from 'ionicons/icons';

@Component({
  selector: 'app-questao',
  templateUrl: './questao.page.html',
  styleUrls: ['./questao.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonButtons, IonIcon, IonAlert, IonLoading, CommonModule, FormsModule]
})
export class QuestaoPage implements OnInit {
  questoes: QuestaoModel[] = [];
  categoriaId: number | null = null;

  constructor(
    private questaoService: QuestaoService,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ pencil, trash, arrowBack, add });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.categoriaId = params['categoriaId'] ? +params['categoriaId'] : null;
      this.carregar();
    });
  }

  async carregar() {
    const loading = await this.loadingCtrl.create({ message: 'Carregando...' });
    await loading.present();

    const obs = this.categoriaId
      ? this.questaoService.listarPorCategoria(this.categoriaId)
      : this.questaoService.listar();

    obs.subscribe({
      next: (data) => {
        this.questoes = data;
        loading.dismiss();
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Falha ao carregar questões.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  getCategoriasNomes(categorias: any[]): string {
    return categorias?.map(c => c.nome).join(', ') || '';
  }

  adicionar() {
    this.router.navigate(['/questao-form']);
  }

  editar(id: number) {
    this.router.navigate(['/questao-form', id]);
  }

  async excluir(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: 'Deseja realmente excluir esta questão?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Excluir', handler: () => this.confirmarExcluir(id) }
      ]
    });
    await alert.present();
  }

  async confirmarExcluir(id: number) {
    const loading = await this.loadingCtrl.create({ message: 'Excluindo...' });
    await loading.present();
    this.questaoService.excluir(id).subscribe({
      next: () => {
        loading.dismiss();
        this.carregar();
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Falha ao excluir.',
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