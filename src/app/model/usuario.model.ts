export class UsuarioModel {
     id: number;
     nome: string;
     email: string;
     senha: string;
     cargo!: 'ALUNO|PROFESSOR'

     constructor() {
          this.id = 0;
          this.nome = "";
          this.email = "";
          this.senha = "";
     }
}
