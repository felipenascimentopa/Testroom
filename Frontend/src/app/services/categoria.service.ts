import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaModel } from '../model/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly API_URL = 'http://localhost:8080/api/v1/categorias';

  constructor(private http: HttpClient) {}

  listarPorProfessor(professorId: number): Observable<CategoriaModel[]> {
    return this.http.get<CategoriaModel[]>(`${this.API_URL}/professor/${professorId}`);
  }

  criar(categoria: CategoriaModel): Observable<CategoriaModel> {
    return this.http.post<CategoriaModel>(this.API_URL, categoria);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}