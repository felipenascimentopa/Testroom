import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TurmaService } from '../../services/turma.service';
import { MatriculaService } from '../../services/matricula.service';
import { AuthService } from '../../services/auth.service';
import { TurmaModel } from '../../model/turma.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-minhas-turmas',
  templateUrl: './minhas-turmas.page.html',
  styleUrls: ['./minhas-turmas.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class MinhasTurmasPage implements OnInit {
  turmas: TurmaModel[] = [];
  carregando = true;
  isProfessor = false;

  constructor(
    private turmaService: TurmaService,
    private matriculaService: MatriculaService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isProfessor = this.authService.isProfessor();
    this.carregarTurmas();
  }

  carregarTurmas(event?: any) {
    const usuarioId = this.authService.obterUsuarioSessao()?.id || 0;
    if (this.isProfessor) {
      this.turmaService.buscarPorProfessor(usuarioId).subscribe({
        next: (data) => { this.turmas = data; this.carregando = false; event?.complete?.(); },
        error: () => { this.carregando = false; event?.complete?.(); }
      });
    } else {
      this.matriculaService.buscarPorAluno(usuarioId).subscribe({
        next: (matriculas) => {
          const ids = matriculas.map(m => m.idTurma);
          if (ids.length) {
            Promise.all(ids.map(id => this.turmaService.buscarPorId(id).toPromise())).then(turmas => {
              this.turmas = turmas.filter(t => t) as TurmaModel[];
              this.carregando = false;
              event?.complete?.();
            });
          } else {
            this.turmas = [];
            this.carregando = false;
            event?.complete?.();
          }
        },
        error: () => { this.carregando = false; event?.complete?.(); }
      });
    }
  }
  isDono(turma: TurmaModel): boolean {
    const usuario = this.authService.obterUsuarioSessao();
    return this.authService.isProfessor() && turma.idProfessor === usuario?.id;
  }
}

