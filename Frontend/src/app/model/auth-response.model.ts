export class AuthResponseModel {
    id: number;
    nome: string;
    email: string;
    tipoUsuario: string;

    constructor() {
        this.id = 0;
        this.nome = "";
        this.email = "";
        this.tipoUsuario = "";
    }
}