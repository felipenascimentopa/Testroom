import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { CategoriaService } from '../../services/categoria.service';
import { QuestaoBancoService } from '../../services/questao-banco.service';
import { AuthService } from '../../services/auth.service';
import { CategoriaModel } from '../../model/categoria.model';
import { QuestaoBancoModel } from '../../model/questao-banco.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-banco-questoes',
  templateUrl: './banco-questoes.page.html',
  styleUrls: ['./banco-questoes.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class BancoQuestoesPage implements OnInit {
  categorias: CategoriaModel[] = [];
  categoriaSelecionada: number | null = null; // Mudei de 0 para null
  questoes: QuestaoBancoModel[] = [];
  carregando = true;

  constructor(
    private categoriaService: CategoriaService,
    private questaoBancoService: QuestaoBancoService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.carregarCategorias();
  }

  async carregarCategorias() {
    const id = this.authService.obterUsuarioSessao()?.id || 0;
    this.categorias = await firstValueFrom(this.categoriaService.listarPorProfessor(id));
    if (this.categorias.length > 0) {
      this.categoriaSelecionada = this.categorias[0].id!;
      this.carregarQuestoes();
    } else {
      this.carregando = false;
    }
  }

  async carregarQuestoes() {
    this.carregando = true;
    // Verificação alterada: Só busca se o ID for válido e diferente de 0
    if (this.categoriaSelecionada) {
      this.questoes = await firstValueFrom(this.questaoBancoService.listarPorCategoria(this.categoriaSelecionada));
    } else {
      this.questoes = [];
    }
    this.carregando = false;
  }
  
  async excluirQuestao(id: number) {
    await firstValueFrom(this.questaoBancoService.excluir(id));
    this.mostrarToast('Questão excluída do banco.');
    this.carregarQuestoes();
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }
}