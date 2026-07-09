import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';
import { CategoriaModel } from '../../model/categoria.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CategoriasPage implements OnInit {
  categorias: CategoriaModel[] = [];
  carregando = true;

  constructor(
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.carregarCategorias();
  }

  async carregarCategorias() {
    const professorId = this.authService.obterUsuarioSessao()?.id || 0;
    this.categorias = await firstValueFrom(this.categoriaService.listarPorProfessor(professorId));
    this.carregando = false;
  }

  async criarCategoria() {
    const alert = await this.alertCtrl.create({
      header: 'Nova Categoria',
      inputs: [
        { name: 'nome', placeholder: 'Nome da categoria', type: 'text' },
        { name: 'idCategoriaPai', placeholder: 'ID da categoria pai (opcional)', type: 'number' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Criar',
          handler: async (data) => {
            if (!data.nome) return false;
            const nova: CategoriaModel = {
              id: 0,
              nome: data.nome,
              idProfessor: this.authService.obterUsuarioSessao()?.id || 0,
              idCategoriaPai: data.idCategoriaPai ? +data.idCategoriaPai : undefined
            };
            await firstValueFrom(this.categoriaService.criar(nova));
            this.mostrarToast('Categoria criada!');
            this.carregarCategorias();
            return true;
          }
        }
      ]
    });
    alert.present();
  }

  async editarCategoria(categoria: CategoriaModel) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Categoria',
      inputs: [{ name: 'nome', placeholder: 'Novo nome', value: categoria.nome, type: 'text' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: async (data) => {
            if (!data.nome) return false;
            const atualizada = { ...categoria, nome: data.nome };
            await firstValueFrom(this.categoriaService.atualizar(categoria.id!, atualizada));
            this.mostrarToast('Categoria atualizada!');
            this.carregarCategorias();
            return true;
          }
        }
      ]
    });
    alert.present();
  }

  verQuestoes(categoriaId: number) {
    this.navCtrl.navigateForward(`/menu/banco-questoes?categoria=${categoriaId}`);
  }


  async excluirCategoria(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Categoria?',
      message: 'Todas as questões do banco vinculadas a ela serão perdidas!',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: async () => {
            try {
              await firstValueFrom(this.categoriaService.excluir(id));
              this.mostrarToast('Categoria excluída');
              this.carregarCategorias();
            } catch (error: any) {
              // Captura o erro e exibe a mensagem do back-end
              let mensagem = 'Erro ao excluir categoria.';
              if (error.status === 409) {
                // O corpo da resposta contém a mensagem de erro
                mensagem = error.error || 'Não é possível excluir: há dependências.';
              } else {
                console.error('Erro ao excluir categoria:', error);
              }
              this.mostrarToast(mensagem);
            }
          }
        }
      ]
    });
    alert.present();
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }
}