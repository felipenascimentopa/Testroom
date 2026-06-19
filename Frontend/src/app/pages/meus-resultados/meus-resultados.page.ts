import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MatriculaService } from '../../services/matricula.service';
import { AtividadeService } from '../../services/atividade.service';
import { RespostaService } from '../../services/resposta.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-meus-resultados',
  templateUrl: './meus-resultados.page.html',
  styleUrls: ['./meus-resultados.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MeusResultadosPage implements OnInit {
  resultados: any[] = [];
  carregando = true;

  constructor(
    private matriculaService: MatriculaService,
    private atividadeService: AtividadeService,
    private respostaService: RespostaService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const alunoId = this.authService.obterUsuarioSessao()?.id || 0;
    try {
      const matriculas = await firstValueFrom(this.matriculaService.buscarPorAluno(alunoId));
      for (const mat of matriculas) {
        const atividades = await firstValueFrom(this.atividadeService.buscarPorTurma(mat.idTurma));
        for (const atv of atividades) {
          try {
            const resposta = await firstValueFrom(this.respostaService.obterResultados(alunoId, atv.id!));
            this.resultados.push({
              turma: mat.idTurma,
              atividade: atv,
              resposta: resposta
            });
          } catch (e) {
            // Ignora se não tiver resposta ainda
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.carregando = false;
    }
  }
}