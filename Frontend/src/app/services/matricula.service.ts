import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatriculaModel } from '../model/matricula.model';

@Injectable({
    providedIn: 'root',
})
export class MatriculaService {
    private readonly API_URL = 'http://localhost:8080/api/v1/matriculas';

    constructor(private http: HttpClient) { }

    listarTodas(): Observable<MatriculaModel[]> {
        return this.http.get<MatriculaModel[]>(this.API_URL);
    }

    buscarPorId(id: number): Observable<MatriculaModel> {
        return this.http.get<MatriculaModel>(`${this.API_URL}/${id}`);
    }

    buscarPorAluno(alunoId: number): Observable<MatriculaModel[]> {
        return this.http.get<MatriculaModel[]>(`${this.API_URL}/aluno/${alunoId}`);
    }

    buscarPorTurma(turmaId: number): Observable<MatriculaModel[]> {
        return this.http.get<MatriculaModel[]>(`${this.API_URL}/turma/${turmaId}`);
    }

    matricular(matricula: MatriculaModel): Observable<MatriculaModel> {
        return this.http.post<MatriculaModel>(this.API_URL, matricula);
    }

    inscreverAluno(alunoId: number, turmaId: number): Observable<MatriculaModel> {
        return this.http.post<MatriculaModel>(this.API_URL, { idAluno: alunoId, idTurma: turmaId });
    }

    excluir(id: number): Observable<MatriculaModel> {
        return this.http.delete<MatriculaModel>(`${this.API_URL}/${id}`);
    }
}