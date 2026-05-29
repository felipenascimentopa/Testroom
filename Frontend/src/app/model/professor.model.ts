export class ProfessorModel {
    id: number;
    nome: string;
    email: string;
    senha: string;
    especialidade: string;

    constructor() {
        this.id = 0;
        this.nome = "";
        this.email = "";
        this.senha = "";
        this.especialidade = "";
    }
}