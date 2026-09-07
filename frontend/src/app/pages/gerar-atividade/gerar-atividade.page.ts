import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AtividadeService } from '../../services/atividade.service';
import { CategoriaService } from '../../services/categoria.service';
import { AtividadeRequest } from '../../model/atividade.model';
import { CategoriaModel } from '../../model/categoria.model';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-gerar-atividade',
  templateUrl: './gerar-atividade.page.html',
  styleUrls: ['./gerar-atividade.page.scss'],
})
export class GerarAtividadePage implements OnInit {
  atividade: AtividadeRequest = { titulo: '', quantidade: 1 };
  categorias: CategoriaModel[] = [];

  constructor(
    private atividadeService: AtividadeService,
    private categoriaService: CategoriaService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.categoriaService.listar().subscribe(data => this.categorias = data);
  }

  async gerar() {
    const loading = await this.loadingCtrl.create({ message: 'Gerando atividade...' });
    await loading.present();

    this.atividadeService.gerar(this.atividade).subscribe({
      next: (res) => {
        loading.dismiss();
        this.router.navigate(['/visualizar-atividade', res.id]);
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: err.error?.message || 'Falha ao gerar atividade.',
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