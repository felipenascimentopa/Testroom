import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList,
  IonButtons, IonIcon, IonLoading, IonAvatar, IonBadge, IonModal, IonInput, IonItem
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaModel } from '../../model/categoria.model';
import { CompartilhamentoPendente, CompartilhamentoCategoria } from '../../model/compartilhamento.model';
import { AuthService } from '../../services/autenticacao.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  add, arrowBack, pencil, trash, shareSocial, checkmark, close,
  personCircleOutline, timeOutline, closeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList,
    IonButtons, IonIcon, IonLoading, IonAvatar, IonBadge, IonModal, IonInput, IonItem,
    CommonModule, FormsModule
  ]
})
export class CategoriaPage implements OnInit {
  categorias: CategoriaModel[] = [];
  pendentes: CompartilhamentoPendente[] = [];
  professorId: number | null = null;

  // modal
  modalAberto = false;
  categoriaAtual: CategoriaModel | null = null;
  compartilhamentos: CompartilhamentoCategoria[] = [];
  novoProfessorId: number | null = null;
  carregandoCompart = false;

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
      personCircleOutline, timeOutline, closeOutline
    });
  }

  ngOnInit() {
    this.professorId = this.authService.getProfessorId();
    this.carregar();
    this.carregarPendentes();
  }

  isOwner(c: CategoriaModel): boolean {
    return !!this.professorId && c.criadorId === this.professorId;
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

  verPerfilProfessor(id?: number) {
    if (!id) return;
    this.router.navigate(['/perfil'], { queryParams: { id } });
  }

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

  async abrirModalCompartilhar(c: CategoriaModel, event: Event) {
    event.stopPropagation();
    this.categoriaAtual = c;
    this.novoProfessorId = null;
    this.compartilhamentos = [];
    this.modalAberto = true;
    await this.recarregarCompartilhamentos();
  }

  fecharModal() {
    this.modalAberto = false;
    this.categoriaAtual = null;
    this.novoProfessorId = null;
  }

  private async recarregarCompartilhamentos() {
    if (!this.categoriaAtual?.id) return;
    this.carregandoCompart = true;
    this.categoriaService.listarCompartilhamentos(this.categoriaAtual.id).subscribe({
      next: (lista) => { this.compartilhamentos = lista; this.carregandoCompart = false; },
      error: async (err) => {
        this.carregandoCompart = false;
        await this.toast(err.error?.message || 'Falha ao carregar compartilhamentos.', 'danger');
      }
    });
  }

  async enviarConvite() {
    if (!this.categoriaAtual?.id || !this.novoProfessorId) return;
    const loading = await this.loadingCtrl.create({ message: 'Enviando convite...' });
    await loading.present();
    this.categoriaService.compartilhar(this.categoriaAtual.id, this.novoProfessorId).subscribe({
      next: async () => {
        loading.dismiss();
        await this.toast('Convite enviado!', 'success');
        this.novoProfessorId = null;
        this.recarregarCompartilhamentos();
      },
      error: async (err) => {
        loading.dismiss();
        await this.toast(err.error?.message || 'Falha ao compartilhar.', 'danger');
      }
    });
  }

  async descompartilhar(c: CompartilhamentoCategoria) {
    if (!this.categoriaAtual?.id) return;
    const alert = await this.alertCtrl.create({
      header: 'Remover compartilhamento',
      message: `Remover acesso de ${c.destinoNome}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover', role: 'destructive',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Removendo...' });
            await loading.present();
            this.categoriaService.descompartilhar(this.categoriaAtual!.id!, c.destinoId).subscribe({
              next: async () => {
                loading.dismiss();
                await this.toast('Compartilhamento removido.', 'medium');
                this.recarregarCompartilhamentos();
                this.carregar();
              },
              error: async (err) => {
                loading.dismiss();
                await this.toast(err.error?.message || 'Falha ao remover.', 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
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
      error: async (err) => {
        loading.dismiss();
        await this.toast(err.error?.message || 'Falha ao excluir.', 'danger');
      }
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