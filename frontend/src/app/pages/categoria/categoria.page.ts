import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonButtons, IonIcon, IonAlert, IonLoading } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaModel } from '../../model/categoria.model';
import { AuthService } from '../../services/autenticacao.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, arrowBack, pencil, trash, shareSocial } from 'ionicons/icons';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonButtons, IonIcon, IonAlert, IonLoading, CommonModule, FormsModule]
})
export class CategoriaPage implements OnInit {
  categorias: CategoriaModel[] = [];
  professorId: number | null = null;

  constructor(
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ pencil, trash, arrowBack, add, shareSocial });
  }

  ngOnInit() {
    this.professorId = this.authService.getProfessorId();
    this.carregar();
  }

  async carregar() {
    const loading = await this.loadingCtrl.create({ message: 'Carregando...' });
    await loading.present();
    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.categorias = data;
        loading.dismiss();
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Falha ao carregar categorias.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  verQuestoes(categoriaId: number) {
    this.router.navigate(['/questoes'], { queryParams: { categoriaId } });
  }

  async compartilhar(categoriaId: number, event: Event) {
    event.stopPropagation(); 
    const alert = await this.alertCtrl.create({
      header: 'Compartilhar Categoria',
      inputs: [
        {
          name: 'professorId',
          type: 'number',
          placeholder: 'ID do professor',
          min: 1
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Compartilhar', handler: (data) => {
          const id = parseInt(data.professorId, 10);
          if (id && id > 0) {
            this.confirmarCompartilhar(categoriaId, id);
          } else {
            return false; 
          }
          return true;
        }}
      ]
    });
    await alert.present();
  }

  async confirmarCompartilhar(categoriaId: number, professorAlvoId: number) {
    const loading = await this.loadingCtrl.create({ message: 'Compartilhando...' });
    await loading.present();
    this.categoriaService.compartilhar(categoriaId, professorAlvoId).subscribe({
      next: () => {
        loading.dismiss();
        this.carregar(); 
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: err.error?.message || 'Falha ao compartilhar.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  adicionar() {
    this.router.navigate(['/categoria-form']);
  }

  editar(id: number, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/categoria-form', id]);
  }

  async excluir(id: number, event: Event) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: 'Deseja realmente excluir esta categoria?',
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
    this.categoriaService.excluir(id).subscribe({
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

  obterNomesCompartilhados(ids: number[]): string {
    return ids.join(', ');
  }
}