import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtividadeModel } from '../model/atividade.model';

@Injectable({
    providedIn: 'root',
})
export class AtividadeService {
    private readonly API_URL = 'http://localhost:8080/api/v1/atividades';

    constructor(private http: HttpClient) { }

    listarTodas(): Observable<AtividadeModel[]> {
        return this.http.get<AtividadeModel[]>(this.API_URL);
    }

    buscarPorId(id: number): Observable<AtividadeModel> {
        return this.http.get<AtividadeModel>(`${this.API_URL}/${id}`);
    }

    buscarPorTurma(turmaId: number): Observable<AtividadeModel[]> {
        return this.http.get<AtividadeModel[]>(`${this.API_URL}/turma/${turmaId}`);
    }

    salvar(atividade: AtividadeModel): Observable<AtividadeModel> {
        if (atividade.id && atividade.id !== 0) {
            return this.http.put<AtividadeModel>(`${this.API_URL}/${atividade.id}`, atividade);
        } else {
            return this.http.post<AtividadeModel>(this.API_URL, atividade);
        }
    }

    excluir(id: number): Observable<AtividadeModel> {
        return this.http.delete<AtividadeModel>(`${this.API_URL}/${id}`);
    }
}