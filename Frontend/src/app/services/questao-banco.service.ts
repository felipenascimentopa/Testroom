import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestaoBancoModel } from '../model/questao-banco.model';

@Injectable({ providedIn: 'root' })
export class QuestaoBancoService {
  private readonly API_URL = 'http://localhost:8080/api/v1/questoes-banco';

  constructor(private http: HttpClient) {}

  listarPorCategoria(categoriaId: number): Observable<QuestaoBancoModel[]> {
    return this.http.get<QuestaoBancoModel[]>(`${this.API_URL}/categoria/${categoriaId}`);
  }

  listarPorProfessor(professorId: number): Observable<QuestaoBancoModel[]> {
    return this.http.get<QuestaoBancoModel[]>(`${this.API_URL}/professor/${professorId}`);
  }

  criar(questao: QuestaoBancoModel): Observable<QuestaoBancoModel> {
    return this.http.post<QuestaoBancoModel>(this.API_URL, questao);
  }

  atualizar(id: number, questao: QuestaoBancoModel): Observable<QuestaoBancoModel> {
    return this.http.put<QuestaoBancoModel>(`${this.API_URL}/${id}`, questao);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  copiarParaAtividade(atividadeId: number, idsQuestoes: number[], randomizar: boolean): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/copiar-para-atividade/${atividadeId}?randomizar=${randomizar}`, idsQuestoes);
  }
}