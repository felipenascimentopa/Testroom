import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespostaAtividadeModel } from '../model/resposta-atividade.model';

@Injectable({ providedIn: 'root' })
export class RespostaService {
  private readonly API_URL = 'http://localhost:8080/api/v1/respostas';

  constructor(private http: HttpClient) { }

  submeter(atividadeId: number, alunoId: number, respostas: any, tempoGasto?: number): Observable<RespostaAtividadeModel> {
    return this.http.post<RespostaAtividadeModel>(
      `${this.API_URL}/submeter?alunoId=${alunoId}&atividadeId=${atividadeId}&tempoGasto=${tempoGasto || 0}`,
      respostas
    );
  }

  obterResultados(alunoId: number, atividadeId: number): Observable<RespostaAtividadeModel> {
    return this.http.get<RespostaAtividadeModel>(`${this.API_URL}/aluno/${alunoId}/atividade/${atividadeId}`);
  }

  obterDetalhes(respostaAtividadeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/detalhes/${respostaAtividadeId}`);
  }

  obterNotaFinal(alunoId: number, atividadeId: number): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/aluno/${alunoId}/atividade/${atividadeId}/final-grade`);
  }
}