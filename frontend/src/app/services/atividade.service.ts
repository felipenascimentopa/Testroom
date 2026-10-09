import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtividadeResponse, AtividadeResumo } from '../model/atividade.model';
import { AuthService } from './autenticacao.service';
import { environment } from '../../environments/environment';
import { AtividadeComQuestoesRequest } from '../model/atividade-com-questao.model';

@Injectable({ providedIn: 'root' })
export class AtividadeService {
  private apiUrl = `${environment.apiUrl}/atividades`;

  constructor(private http: HttpClient, private auth: AuthService) { }

  buscarPorId(id: number): Observable<AtividadeResponse> {
    return this.http.get<AtividadeResponse>(`${this.apiUrl}/${id}`);
  }

  criarComQuestoes(dto: AtividadeComQuestoesRequest): Observable<AtividadeResponse[]> {
    const professorId = this.auth.getProfessorId();
    return this.http.post<AtividadeResponse[]>(`${this.apiUrl}/criar-com-questoes?professorId=${professorId}`, dto);
  }

  listar(): Observable<AtividadeResumo[]> {
    const professorId = this.auth.getProfessorId();
    return this.http.get<AtividadeResumo[]>(`${this.apiUrl}?professorId=${professorId}`);
  }

  buscarHtml(id: number): Observable<{ html: string }> {
    return this.http.get<{ html: string }>(`${this.apiUrl}/${id}/html`);
  }

  salvarHtml(id: number, html: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/html`, { html });
  }

  baixarPdfHtml(id: number, tipo: 'prova' | 'gabarito' = 'prova'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf-html?tipo=${tipo}`, { responseType: 'blob' });
  }

  excluir(id: number): Observable<void> {
    const professorId = this.auth.getProfessorId();
    return this.http.delete<void>(`${this.apiUrl}/${id}?professorId=${professorId}`);
  }
}