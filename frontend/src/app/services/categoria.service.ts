import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaModel } from '../model/categoria.model';
import { AuthService } from './autenticacao.service';
import { environment } from '../../environments/environment';
import { CompartilhamentoPendente } from '../model/compartilhamento.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
    private apiUrl = `${environment.apiUrl}/categorias`;

    constructor(private http: HttpClient, private auth: AuthService) { }

    private getProfessorId(): number {
        const id = this.auth.getProfessorId();
        if (!id) throw new Error('Professor não logado');
        return id;
    }

    criar(categoria: CategoriaModel): Observable<CategoriaModel> {
        const professorId = this.getProfessorId();
        return this.http.post<CategoriaModel>(`${this.apiUrl}?professorId=${professorId}`, categoria);
    }

    listar(): Observable<CategoriaModel[]> {
        const professorId = this.getProfessorId();
        return this.http.get<CategoriaModel[]>(`${this.apiUrl}?professorId=${professorId}`);
    }

    buscarPorId(id: number): Observable<CategoriaModel> {
        return this.http.get<CategoriaModel>(`${this.apiUrl}/${id}`);
    }

    atualizar(id: number, categoria: CategoriaModel): Observable<CategoriaModel> {
        const professorId = this.getProfessorId();
        return this.http.put<CategoriaModel>(`${this.apiUrl}/${id}?professorId=${professorId}`, categoria);
    }

    excluir(id: number): Observable<void> {
        const professorId = this.getProfessorId();
        return this.http.delete<void>(`${this.apiUrl}/${id}?professorId=${professorId}`);
    }

    descompartilhar(categoriaId: number, professorAlvoId: number): Observable<void> {
        const professorOrigemId = this.getProfessorId();
        return this.http.delete<void>(`${this.apiUrl}/${categoriaId}/compartilhar/${professorAlvoId}?professorOrigemId=${professorOrigemId}`);
    }

    listarPendentes(): Observable<CompartilhamentoPendente[]> {
        const professorId = this.auth.getProfessorId();
        return this.http.get<CompartilhamentoPendente[]>(
            `${this.apiUrl}/compartilhamentos-pendentes?professorId=${professorId}`);
    }

    aceitarCompartilhamento(id: number): Observable<void> {
        const professorId = this.auth.getProfessorId();
        return this.http.post<void>(
            `${this.apiUrl}/compartilhamentos/${id}/aceitar?professorId=${professorId}`, {});
    }

    recusarCompartilhamento(id: number): Observable<void> {
        const professorId = this.auth.getProfessorId();
        return this.http.post<void>(
            `${this.apiUrl}/compartilhamentos/${id}/recusar?professorId=${professorId}`, {});
    }

    compartilhar(categoriaId: number, professorAlvoId: number): Observable<void> {
        const professorId = this.auth.getProfessorId();
        return this.http.post<void>(
            `${this.apiUrl}/${categoriaId}/compartilhar?professorId=${professorId}&professorAlvoId=${professorAlvoId}`,
            {});
    }
}