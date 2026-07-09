import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { CategoriaService } from '../../services/categoria.service';
import { QuestaoBancoService } from '../../services/questao-banco.service';
import { AuthService } from '../../services/auth.service';
import { CategoriaModel } from '../../model/categoria.model';
import { QuestaoBancoModel } from '../../model/questao-banco.model';
import { AdicionarEditarQuestaoBancoComponent } from '../../components/adicionar-editar-questao-banco/adicionar-editar-questao-banco.component';
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
  categoriaSelecionada: number | null = null;
  questoes: QuestaoBancoModel[] = [];
  carregando = true;

  constructor(
    private categoriaService: CategoriaService,
    private questaoBancoService: QuestaoBancoService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const catId = params['categoria'];
      if (catId) {
        this.categoriaSelecionada = +catId;
      }
    });
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
  if (this.categoriaSelecionada) {
    this.questoes = await firstValueFrom(this.questaoBancoService.listarPorCategoria(this.categoriaSelecionada));
  } else {
    this.questoes = [];
  }
  this.carregando = false;
}

  async editarQuestao(questao: QuestaoBancoModel) {
  const modal = await this.modalCtrl.create({
    component: AdicionarEditarQuestaoBancoComponent,
    componentProps: {
      categorias: this.categorias,
      questaoEdicao: questao
    }
  });
  modal.onDidDismiss().then(result => {
    if (result.data?.success) {
      this.carregarQuestoes();
    }
  });
  await modal.present();
}

  async abrirModalCriar() {
  const modal = await this.modalCtrl.create({
    component: AdicionarEditarQuestaoBancoComponent,
    componentProps: { categorias: this.categorias }
  });
  modal.onDidDismiss().then(result => {
    if (result.data?.success) {
      this.carregarQuestoes();
    }
  });
  await modal.present();
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