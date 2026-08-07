import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../model/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
    private apiUrl = 'http://localhost:8080/usuarios';

    constructor(private http: HttpClient) {}

    criar(usuario: UsuarioModel): Observable<UsuarioModel> {
        return this.http.post<UsuarioModel>(this.apiUrl, usuario);
    }
}