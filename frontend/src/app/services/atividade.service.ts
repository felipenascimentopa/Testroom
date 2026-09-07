import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtividadeRequest, AtividadeResponse } from '../model/atividade.model';
import { AuthService } from './autenticacao.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AtividadeService {
    private apiUrl = `${environment.apiUrl}/atividades`;

    constructor(private http: HttpClient, private auth: AuthService) {}

    gerar(atividade: AtividadeRequest): Observable<AtividadeResponse> {
        const professorId = this.auth.getProfessorId();
        return this.http.post<AtividadeResponse>(`${this.apiUrl}/gerar?professorId=${professorId}`, atividade);
    }

    exportarPdf(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
    }
}