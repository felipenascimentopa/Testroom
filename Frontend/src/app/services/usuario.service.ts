import { Injectable } from '@angular/core';
import { UsuarioModel } from '../model/usuario.model';

@Injectable({
     providedIn: 'root',
})
export class UsuarioService {
     constructor() { }

     salvar(usuario: UsuarioModel): UsuarioModel {
          let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
          if (usuario.id === 0) {
               usuario.id = (new Date().getTime() / 1000) * Math.random();
               usuarios.push(usuario);
          } else {
               let posicao = usuarios.findIndex((temp: UsuarioModel) => temp.id === usuario.id);
               usuarios[posicao] = usuario;
          }
          localStorage.setItem('usuarios', JSON.stringify(usuarios));
          return usuario;
     }

     listar(): UsuarioModel[] {
          let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
          return usuarios;
     }

     buscarPorId(id: number): UsuarioModel {
          let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
          let usuario = new UsuarioModel();
          usuario = usuarios.find((temp: UsuarioModel) => temp.id === id);
          return usuario;
     }

     excluir(id: number): boolean {
          let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
          usuarios = usuarios.filter((temp: UsuarioModel) => temp.id !== id);
          localStorage.setItem('usuarios', JSON.stringify(usuarios));
          return true;
     }

     verificarEmail(email: String): boolean {
          let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
          return !!usuarios.find((temp: UsuarioModel) => temp.email === email);
     }

     autenticar(email: String, senha: String): UsuarioModel {
          let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
          let usuario = new UsuarioModel();
          usuario = usuarios.find((temp: UsuarioModel) => temp.email === email && temp.senha === senha);
          return usuario;
     }

     buscarAutenticacao(): UsuarioModel {
          let usuario = JSON.parse(localStorage.getItem('usuarioAutenticado') || '{}');
          return usuario;
     }

     registrarAutenticacao(usuario: UsuarioModel) {
          localStorage.setItem('usuarioAutenticado', JSON.stringify(usuario));
     }

     encerrarAutenticacao() {
          localStorage.removeItem('usuarioAutenticado');
     }

}
