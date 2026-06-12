import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { QuestaoBancoService } from '../../services/questao-banco.service';
import { AuthService } from '../../services/auth.service';
import { CategoriaModel } from '../../model/categoria.model';
import { QuestaoBancoModel } from '../../model/questao-banco.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-selecionar-questoes-banco',
  templateUrl: './selecionar-questoes-banco.page.html',
  styleUrls: ['./selecionar-questoes-banco.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class SelecionarQuestoesBancoPage implements OnInit {
  atividadeId: number = 0;
  categorias: CategoriaModel[] = [];
  categoriasSelecionadas: number[] = [];
  questoesBanco: QuestaoBancoModel[] = [];
  selecionadas: { [id: number]: boolean } = {};
  randomizar: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    private questaoBancoService: QuestaoBancoService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.atividadeId = +this.route.snapshot.paramMap.get('atividadeId')!;
    this.carregarCategorias();
  }

  async carregarCategorias() {
    const professorId = this.authService.obterUsuarioSessao()?.id || 0;
    this.categorias = await firstValueFrom(this.categoriaService.listarPorProfessor(professorId));
  }

  async carregarQuestoes() {
    if (this.categoriasSelecionadas.length === 0) {
      this.questoesBanco = [];
      return;
    }
    let todas: QuestaoBancoModel[] = [];
    for (const catId of this.categoriasSelecionadas) {
      const questoes = await firstValueFrom(this.questaoBancoService.listarPorCategoria(catId));
      todas = [...todas, ...questoes];
    }
    this.questoesBanco = todas.filter((q, idx, self) => self.findIndex(t => t.id === q.id) === idx);
    this.selecionadas = {};
  }

  get idsSelecionados(): number[] {
    return Object.keys(this.selecionadas).filter(k => this.selecionadas[+k]).map(Number);
  }

  async adicionarSelecionadas() {
    if (this.idsSelecionados.length === 0) {
      this.mostrarToast('Selecione pelo menos uma questão.');
      return;
    }
    try {
      await firstValueFrom(
        this.questaoBancoService.copiarParaAtividade(this.atividadeId, this.idsSelecionados, this.randomizar)
      );
      this.mostrarToast('Questões adicionadas com sucesso!');
      this.navCtrl.navigateBack(`/menu/gerenciar-questoes/${this.atividadeId}`);
    } catch (error) {
      this.mostrarToast('Erro ao adicionar questões.');
    }
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }
}