export class AlternativaBancoModel {
  id: number;
  idQuestaoBanco: number;
  texto: string;
  correta: boolean;
  ordem: number;
  feedback?: string;

  constructor() {
    this.id = 0;
    this.idQuestaoBanco = 0;
    this.texto = '';
    this.correta = false;
    this.ordem = 0;
  }
}