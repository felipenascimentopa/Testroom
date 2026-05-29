export class TurmaModel {
    id: number;
    nome: string;
    descricao: string;
    codigoAcesso: string;
    idProfessor: number;
    dataCriacao: string;

    constructor() {
        this.id = 0;
        this.nome = "";
        this.descricao = "";
        this.codigoAcesso = "";
        this.idProfessor = 0;
        this.dataCriacao = "";
    }
}