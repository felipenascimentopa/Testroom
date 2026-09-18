import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem,
  IonLabel, IonButtons, IonIcon, IonAlert, IonLoading, IonBadge, IonAvatar,
  IonNote, IonItemSliding, IonItemOptions, IonItemOption
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaModel } from '../../model/categoria.model';
import { CompartilhamentoPendente } from '../../model/compartilhamento.model';
import { AuthService } from '../../services/autenticacao.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  add, arrowBack, pencil, trash, shareSocial, checkmark, close,
  personCircleOutline, timeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem,
    IonLabel, IonButtons, IonIcon, IonAlert, IonLoading, IonBadge, IonAvatar,
    IonNote, IonItemSliding, IonItemOptions, IonItemOption,
    CommonModule, FormsModule
  ]
})
export class CategoriaPage implements OnInit {
  categorias: CategoriaModel[] = [];
  pendentes: CompartilhamentoPendente[] = [];
  professorId: number | null = null;

  constructor(
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      pencil, trash, arrowBack, add, shareSocial, checkmark, close,
      personCircleOutline, timeOutline
    });
  }

  ngOnInit() {
    this.professorId = this.authService.getProfessorId();
    this.carregar();
    this.carregarPendentes();
  }

  async carregar() {
    const loading = await this.loadingCtrl.create({ message: 'Carregando...' });
    await loading.present();
    this.categoriaService.listar().subscribe({
      next: (data) => { this.categorias = data; loading.dismiss(); },
      error: async () => { loading.dismiss(); await this.toast('Falha ao carregar.', 'danger'); }
    });
  }

  carregarPendentes() {
    this.categoriaService.listarPendentes().subscribe({
      next: (data) => this.pendentes = data,
      error: () => this.pendentes = []
    });
  }

  // --- Perfil ---
  verPerfilProfessor(id?: number) {
    if (!id) return;
    this.router.navigate(['/perfil'], { queryParams: { id } });
  }

  // --- Aceite ---
  async aceitar(p: CompartilhamentoPendente) {
    const loading = await this.loadingCtrl.create({ message: 'Aceitando...' });
    await loading.present();
    this.categoriaService.aceitarCompartilhamento(p.id).subscribe({
      next: async () => {
        loading.dismiss();
        await this.toast('Categoria adicionada!', 'success');
        this.carregar();
        this.carregarPendentes();
      },
      error: async (err) => {
        loading.dismiss();
        await this.toast(err.error?.message || 'Falha ao aceitar.', 'danger');
      }
    });
  }

  async recusar(p: CompartilhamentoPendente) {
    const loading = await this.loadingCtrl.create({ message: 'Recusando...' });
    await loading.present();
    this.categoriaService.recusarCompartilhamento(p.id).subscribe({
      next: async () => {
        loading.dismiss();
        await this.toast('Convite recusado.', 'medium');
        this.carregarPendentes();
      },
      error: async () => { loading.dismiss(); await this.toast('Falha ao recusar.', 'danger'); }
    });
  }

  verQuestoes(categoriaId: number) {
    this.router.navigate(['/questoes'], { queryParams: { categoriaId } });
  }

  async compartilhar(categoriaId: number, event: Event) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Compartilhar Categoria',
      message: 'O professor receberá um convite e precisará aceitar.',
      inputs: [{ name: 'professorId', type: 'number', placeholder: 'ID do professor', min: 1 }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Enviar convite',
          handler: (data) => {
            const id = parseInt(data.professorId, 10);
            if (id && id > 0) { this.confirmarCompartilhar(categoriaId, id); return true; }
            return false;
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarCompartilhar(categoriaId: number, professorAlvoId: number) {
    const loading = await this.loadingCtrl.create({ message: 'Enviando convite...' });
    await loading.present();
    this.categoriaService.compartilhar(categoriaId, professorAlvoId).subscribe({
      next: async () => {
        loading.dismiss();
        await this.toast('Convite enviado!', 'success');
      },
      error: async (err) => {
        loading.dismiss();
        await this.toast(err.error?.message || 'Falha ao compartilhar.', 'danger');
      }
    });
  }

  adicionar() { this.router.navigate(['/categoria-form']); }

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
      next: () => { loading.dismiss(); this.carregar(); },
      error: async () => { loading.dismiss(); await this.toast('Falha ao excluir.', 'danger'); }
    });
  }

  voltar() { this.router.navigate(['/menu']); }

  private async toast(msg: string, color = 'danger') {
    const t = await this.toastCtrl.create({ message: msg, duration: 2200, color });
    await t.present();
  }

  getAvatar(nome?: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nome || '?')}&background=1a2f3a&color=fff&size=64`;
  }
}