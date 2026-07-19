import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { TokenModel } from '../model/token.model';

@Injectable({
     providedIn: 'root',
})
export class TokenService {
     private readonly AUTORIZACAO_USUARIO = 'Authorization';

     setToken(token: string): void {
          localStorage.setItem(this.AUTORIZACAO_USUARIO, JSON.stringify(token));
     }

     getToken() : string | null {
          return localStorage.getItem(this.AUTORIZACAO_USUARIO);
     }

     excluir(): void {
          localStorage.removeItem(this.AUTORIZACAO_USUARIO);
     }

     getCabecalhoAutenticacao(): string | null {
          const token = this.getToken();
          return token ? `${this.AUTORIZACAO_USUARIO} ${token}` : null;
     }

}
