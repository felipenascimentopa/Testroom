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

    obterPerfil(): Observable<ProfessorModel> {
        const id = this.auth.getProfessorId();
        return this.http.get<ProfessorModel>(`${this.apiUrl}/perfil?professorId=${id}`);
    }

    buscarPorId(id: number): Observable<ProfessorModel> {
        return this.http.get<ProfessorModel>(`${this.apiUrl}/${id}`);
    }

    atualizarNome(id: number, nome: string): Observable<ProfessorModel> {
        return this.http.put<ProfessorModel>(`${this.apiUrl}/${id}/nome`, { nome });
    }

    atualizarFoto(id: number, fotoUrl: string): Observable<ProfessorModel> {
        return this.http.put<ProfessorModel>(`${this.apiUrl}/${id}/foto`, { foto: fotoUrl });
    }
}