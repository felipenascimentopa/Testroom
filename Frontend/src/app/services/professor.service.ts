import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfessorModel } from '../model/professor.model';

@Injectable({
    providedIn: 'root',
})
export class ProfessorService {
    private readonly API_URL = 'http://localhost:8080/api/v1/professores';

    constructor(private http: HttpClient) { }

    listarTodos(): Observable<ProfessorModel[]> {
        return this.http.get<ProfessorModel[]>(this.API_URL);
    }

    buscarPorId(id: number): Observable<ProfessorModel> {
        return this.http.get<ProfessorModel>(`${this.API_URL}/${id}`);
    }

    salvar(professor: ProfessorModel): Observable<ProfessorModel> {
        if (professor.id && professor.id !== 0) {
            return this.http.put<ProfessorModel>(this.API_URL, professor);
        } else {
            return this.http.post<ProfessorModel>(this.API_URL, professor);
        }
    }

    excluir(id: number): Observable<ProfessorModel> {
        return this.http.delete<ProfessorModel>(`${this.API_URL}/${id}`);
    }
}