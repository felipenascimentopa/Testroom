import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonButtons, IonLoading, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaModel } from '../../model/categoria.model';
import { AlertController, LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, arrowBack, pencil, trash } from 'ionicons/icons';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.page.html',
  styleUrls: ['./categoria-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonButtons, IonLoading, IonIcon, CommonModule, FormsModule]
})
export class CategoriaFormPage implements OnInit {
  categoria: CategoriaModel = { nome: '', descricao: '' };
  isEdit = false;
  id?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoriaService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ pencil, trash, arrowBack, add });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.id = +idParam;
      this.carregarCategoria(this.id);
    }
  }

  async carregarCategoria(id: number) {
    const loading = await this.loadingCtrl.create({ message: 'Carregando...' });
    await loading.present();
    this.categoriaService.buscarPorId(id).subscribe({
      next: (data) => {
        this.categoria = data;
        loading.dismiss();
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Falha ao carregar categoria.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  async salvar() {
    const loading = await this.loadingCtrl.create({ message: 'Salvando...' });
    await loading.present();

    const obs = this.isEdit
      ? this.categoriaService.atualizar(this.id!, this.categoria)
      : this.categoriaService.criar(this.categoria);

    obs.subscribe({
      next: () => {
        loading.dismiss();
        this.router.navigate(['/categorias']);
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: err.error?.message || 'Falha ao salvar.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  voltar() {
    this.router.navigate(['/categorias']);
  }
}