import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponseModel } from '../model/auth-response.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly API_URL = 'http://localhost:8080/api/v1/auth';
    private readonly KEY_USUARIO = 'usuarioAutenticado';
    private readonly KEY_TIPO = 'tipoUsuario';

    constructor(private http: HttpClient) { }

    login(credenciais: { email: string; senha: string }): Observable<AuthResponseModel> {
        return this.http.post<AuthResponseModel>(`${this.API_URL}/login`, credenciais);
    }

    salvarSessao(usuario: AuthResponseModel): void {
        localStorage.setItem(this.KEY_USUARIO, JSON.stringify(usuario));
        localStorage.setItem(this.KEY_TIPO, usuario.tipoUsuario);
    }

    obterUsuarioSessao(): AuthResponseModel | null {
        const usuarioJson = localStorage.getItem(this.KEY_USUARIO);
        if (usuarioJson) {
            return JSON.parse(usuarioJson) as AuthResponseModel;
        }
        return null;
    }

    obterTipoUsuario(): string | null {
        return localStorage.getItem(this.KEY_TIPO);
    }

    isAluno(): boolean {
        return this.obterTipoUsuario() === 'ALUNO';
    }

    isProfessor(): boolean {
        return this.obterTipoUsuario() === 'PROFESSOR';
    }

    limparSessao(): void {
        localStorage.removeItem(this.KEY_USUARIO);
        localStorage.removeItem(this.KEY_TIPO);
    }

    verificarSessao(): boolean {
        return localStorage.getItem(this.KEY_USUARIO) !== null;
    }
}