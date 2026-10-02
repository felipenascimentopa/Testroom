import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtividadeRequest, AtividadeResponse, AtividadeResumo } from '../model/atividade.model';
import { AuthService } from './autenticacao.service';
import { environment } from '../../environments/environment';
import { AtividadeComQuestoesRequest } from '../model/atividade-com-questao.model';
import { HttpParams } from '@angular/common/http';
import { PdfOptions } from '../model/pdf-options.model';

@Injectable({ providedIn: 'root' })
export class AtividadeService {
  private apiUrl = `${environment.apiUrl}/atividades`;

  private buildPdfParams(options: PdfOptions): HttpParams {
    let params = new HttpParams();
    Object.entries(options).forEach(([k, v]) => {
      params = params.set(k, String(v));
    });
    return params;
  }

  constructor(private http: HttpClient, private auth: AuthService) { }

  exportarPdf(id: number, options: PdfOptions): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, {
      responseType: 'blob',
      params: this.buildPdfParams(options)
    });
  }

  buscarPorId(id: number): Observable<AtividadeResponse> {
    return this.http.get<AtividadeResponse>(`${this.apiUrl}/${id}`);
  }

  criarComQuestoes(dto: AtividadeComQuestoesRequest): Observable<AtividadeResponse[]> {
    const professorId = this.auth.getProfessorId();
    return this.http.post<AtividadeResponse[]>(`${this.apiUrl}/criar-com-questoes?professorId=${professorId}`, dto);
  }

  exportarGabarito(id: number, options: PdfOptions): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/gabarito`, {
      responseType: 'blob',
      params: this.buildPdfParams(options)
    });
  }

  salvarLayout(id: number, layout: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/layout`, layout);
  }

  listar(): Observable<AtividadeResumo[]> {
    const professorId = this.auth.getProfessorId();
    return this.http.get<AtividadeResumo[]>(`${this.apiUrl}?professorId=${professorId}`);
  }

  excluir(id: number): Observable<void> {
    const professorId = this.auth.getProfessorId();
    return this.http.delete<void>(`${this.apiUrl}/${id}?professorId=${professorId}`);
  }
}