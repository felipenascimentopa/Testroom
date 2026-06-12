// questao.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestaoModel } from '../model/questao.model';
import { AlternativaModel } from '../model/alternativa.model';

@Injectable({ providedIn: 'root' })
export class QuestaoService {
  private readonly API_URL = 'http://localhost:8080/api/v1/questoes';
  private readonly ALT_URL = 'http://localhost:8080/api/v1/alternativas';

  constructor(private http: HttpClient) {}

  listarPorAtividade(atividadeId: number): Observable<QuestaoModel[]> {
    return this.http.get<QuestaoModel[]>(`${this.API_URL}/atividade/${atividadeId}`);
  }

  buscarPorId(id: number): Observable<QuestaoModel> {
    return this.http.get<QuestaoModel>(`${this.API_URL}/${id}`);
  }

  criar(questao: QuestaoModel): Observable<QuestaoModel> {
    return this.http.post<QuestaoModel>(this.API_URL, questao);
  }

  atualizar(id: number, questao: QuestaoModel): Observable<QuestaoModel> {
    return this.http.put<QuestaoModel>(`${this.API_URL}/${id}`, questao);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // Alternativas
  listarAlternativas(questaoId: number): Observable<AlternativaModel[]> {
    return this.http.get<AlternativaModel[]>(`${this.ALT_URL}/questao/${questaoId}`);
  }

  criarAlternativa(alt: AlternativaModel): Observable<AlternativaModel> {
    return this.http.post<AlternativaModel>(this.ALT_URL, alt);
  }

  atualizarAlternativa(id: number, alt: AlternativaModel): Observable<AlternativaModel> {
    return this.http.put<AlternativaModel>(`${this.ALT_URL}/${id}`, alt);
  }

  excluirAlternativa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ALT_URL}/${id}`);
  }
}