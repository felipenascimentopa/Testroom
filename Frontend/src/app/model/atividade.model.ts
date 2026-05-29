export class AtividadeModel {
    id: number;
    idTurma: number;
    titulo: string;
    descricao: string;
    dtCriacao: string;
    dtEntrega: string;
    disponivel: boolean;

    constructor() {
        this.id = 0;
        this.idTurma = 0;
        this.titulo = "";
        this.descricao = "";
        this.dtCriacao = "";
        this.dtEntrega = "";
        this.disponivel = true;
    }
}