export class RespostaQuestaoModel {
  id: number;
  idRespostaAtividade: number;
  idQuestao: number;
  respostaTexto?: string;
  acerto?: boolean;

  constructor() {
    this.id = 0;
    this.idRespostaAtividade = 0;
    this.idQuestao = 0;
  }
}