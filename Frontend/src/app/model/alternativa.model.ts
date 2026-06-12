export class AlternativaModel {
  id: number;
  idQuestao: number;
  texto: string;
  correta: boolean;
  ordem: number;

  constructor() {
    this.id = 0;
    this.idQuestao = 0;
    this.texto = '';
    this.correta = false;
    this.ordem = 0;
  }
}