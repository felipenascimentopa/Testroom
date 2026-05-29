export class MatriculaModel {
    id: number;
    idAluno: number;
    idTurma: number;
    dataMatricula: string;
    ativo: boolean;

    constructor() {
        this.id = 0;
        this.idAluno = 0;
        this.idTurma = 0;
        this.dataMatricula = "";
        this.ativo = true;
    }
}