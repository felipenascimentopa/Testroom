import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlunoModel } from '../model/aluno.model';

@Injectable({
    providedIn: 'root',
})
export class AlunoService {
    private readonly API_URL = 'http://localhost:8080/api/v1/alunos';

    constructor(private http: HttpClient) { }

    listarTodos(): Observable<AlunoModel[]> {
        return this.http.get<AlunoModel[]>(this.API_URL);
    }

    buscarPorId(id: number): Observable<AlunoModel> {
        return this.http.get<AlunoModel>(`${this.API_URL}/${id}`);
    }

    salvar(aluno: AlunoModel): Observable<AlunoModel> {
        if (aluno.id && aluno.id !== 0) {
            return this.http.put<AlunoModel>(this.API_URL, aluno);
        } else {
            return this.http.post<AlunoModel>(this.API_URL, aluno);
        }
    }

    excluir(id: number): Observable<AlunoModel> {
        return this.http.delete<AlunoModel>(`${this.API_URL}/${id}`);
    }
}