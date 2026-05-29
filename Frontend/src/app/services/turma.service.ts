import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TurmaModel } from '../model/turma.model';

@Injectable({
    providedIn: 'root',
})
export class TurmaService {
    private readonly API_URL = 'http://localhost:8080/api/v1/turmas';

    constructor(private http: HttpClient) { }

    listarTodas(): Observable<TurmaModel[]> {
        return this.http.get<TurmaModel[]>(this.API_URL);
    }

    buscarPorId(id: number): Observable<TurmaModel> {
        return this.http.get<TurmaModel>(`${this.API_URL}/${id}`);
    }

    buscarPorProfessor(professorId: number): Observable<TurmaModel[]> {
        return this.http.get<TurmaModel[]>(`${this.API_URL}/professor/${professorId}`);
    }

    salvar(turma: TurmaModel): Observable<TurmaModel> {
        if (turma.id && turma.id !== 0) {
            return this.http.put<TurmaModel>(`${this.API_URL}/${turma.id}`, turma);
        } else {
            return this.http.post<TurmaModel>(this.API_URL, turma);
        }
    }

    excluir(id: number): Observable<TurmaModel> {
        return this.http.delete<TurmaModel>(`${this.API_URL}/${id}`);
    }
}