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
    private toastCtrl: ToastController
  ) {}

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
      inputs: [{ name: 'nome', placeholder: 'Nome da categoria', type: 'text' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Criar',
          handler: async (data) => {
            if (!data.nome) return false;
            
            // CORREÇÃO AQUI: Não envie o ID. Spring Boot irá gerar um ID automático.
            // Envie apenas os campos necessários.
            const nova: any = {
              nome: data.nome,
              idProfessor: this.authService.obterUsuarioSessao()?.id || 0
            };
            
            await firstValueFrom(this.categoriaService.criar(nova as CategoriaModel));
            this.mostrarToast('Categoria criada!');
            this.carregarCategorias();
            return true;
          }
        }
      ]
    });
    alert.present();
  }

  async excluirCategoria(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Categoria?',
      message: 'Todas as questões do banco vinculadas a ela serão perdidas!',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Excluir', handler: async () => {
            await firstValueFrom(this.categoriaService.excluir(id));
            this.mostrarToast('Categoria excluída');
            this.carregarCategorias();
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