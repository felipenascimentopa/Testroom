import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfessorModel } from '../model/professor.model';
import { AuthService } from './autenticacao.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfessorService {
  private apiUrl = `${environment.apiUrl}/professores`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  listarTodos(): Observable<ProfessorModel[]> {
    return this.http.get<ProfessorModel[]>(this.apiUrl);
  }

  obterPerfil(): Observable<ProfessorModel> {
        const professorId = this.auth.getProfessorId();
        if (!professorId) throw new Error('Professor não logado');
        return this.http.get<ProfessorModel>(`${this.apiUrl}/perfil?professorId=${professorId}`);
    }

  atualizarNome(professorId: number, nome: string): Observable<{ nome: string }> {
    return this.http.put<{ nome: string }>(`${this.apiUrl}/${professorId}/nome`, { nome });
  }

  atualizarFoto(professorId: number, fotoUrl: string): Observable<{ foto: string }> {
    return this.http.put<{ foto: string }>(`${this.apiUrl}/${professorId}/foto`, { fotoUrl });
  }
}