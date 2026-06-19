export class AtividadeModel {
    id: number;
    idTurma: number;
    titulo: string;
    descricao: string;
    dtCriacao: string;
    dtEntrega: string;
    disponivel: boolean;
    
    tentativasMax: number;
    calculoNota: 'ULTIMA' | 'MEDIA' | 'MELHOR';
    permiteVerGabaritoAntecipado: boolean;
    permiteVerFeedbackAntecipado: boolean;
    permiteVerNotaAntecipado: boolean;
    permiteVerRespostasAntecipado: boolean;

    constructor() {
        this.id = 0;
        this.idTurma = 0;
        this.titulo = "";
        this.descricao = "";
        this.dtCriacao = "";
        this.dtEntrega = "";
        this.disponivel = true;
        this.tentativasMax = 1;
        this.calculoNota = 'ULTIMA';
        this.permiteVerGabaritoAntecipado = false;
        this.permiteVerFeedbackAntecipado = false;
        this.permiteVerNotaAntecipado = false;
        this.permiteVerRespostasAntecipado = false;
    }
}