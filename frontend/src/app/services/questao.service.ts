import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestaoModel } from '../model/questao.model';
import { AuthService } from './autenticacao.service';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class QuestaoService {
    private apiUrl = `${environment.apiUrl}/questoes`;

    constructor(private http: HttpClient, private auth: AuthService) { }

    private getProfessorId(): number {
        const id = this.auth.getProfessorId();
        if (!id) throw new Error('Professor não logado');
        return id;
    }

    criar(questao: QuestaoModel): Observable<QuestaoModel> {
        const professorId = this.getProfessorId();
        return this.http.post<QuestaoModel>(`${this.apiUrl}?professorId=${professorId}`, questao);
    }

    listar(): Observable<QuestaoModel[]> {
        const professorId = this.getProfessorId();
        return this.http.get<QuestaoModel[]>(`${this.apiUrl}?professorId=${professorId}`);
    }

    buscarPorId(id: number): Observable<QuestaoModel> {
        return this.http.get<QuestaoModel>(`${this.apiUrl}/${id}`);
    }

    listarPorCategoria(categoriaId: number): Observable<QuestaoModel[]> {
        const professorId = this.getProfessorId();
        return this.http.get<QuestaoModel[]>(`${this.apiUrl}/por-categoria?categoriaId=${categoriaId}&professorId=${professorId}`);
    }

    listarPorCategorias(categoriaIds: number[]): Observable<QuestaoModel[]> {
        const professorId = this.getProfessorId();
        if (!categoriaIds || categoriaIds.length === 0) {
            return this.listar();
        }

        let params = new HttpParams();
        params = params.set('professorId', professorId.toString());
        categoriaIds.forEach(id => {
            params = params.append('categoriaIds', id.toString());
        });

        return this.http.get<QuestaoModel[]>(`${this.apiUrl}/por-categorias`, { params });
    }

    atualizar(id: number, questao: QuestaoModel): Observable<QuestaoModel> {
        const professorId = this.getProfessorId();
        return this.http.put<QuestaoModel>(`${this.apiUrl}/${id}?professorId=${professorId}`, questao);
    }

    excluir(id: number): Observable<void> {
        const professorId = this.getProfessorId();
        return this.http.delete<void>(`${this.apiUrl}/${id}?professorId=${professorId}`);
    }
}