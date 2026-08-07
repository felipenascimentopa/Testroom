import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../model/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(email: string, senha: string): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(`${this.apiUrl}/login`, { email, senha });
  }

  salvarUsuario(usuario: UsuarioModel): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario(): UsuarioModel | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  getProfessorId(): number | null {
    const usuario = this.getUsuario();
    return usuario && usuario.cargo === 'PROFESSOR' ? usuario.professorId ?? null : null;
  }

  logout(): void {
    localStorage.removeItem('usuario');
  }
}