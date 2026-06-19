export class RespostaAtividadeModel {
  id: number;
  idAtividade: number;
  idAluno: number;
  nota: number;
  dtEnvio: string;
  tempoGasto?: number;
  tentativaNumero?: number; 

  constructor() {
    this.id = 0;
    this.idAtividade = 0;
    this.idAluno = 0;
    this.nota = 0;
    this.dtEnvio = '';
  }
}