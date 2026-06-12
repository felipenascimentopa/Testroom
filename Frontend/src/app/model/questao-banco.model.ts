import { TipoPergunta } from './questao.model';

export class QuestaoBancoModel {
  id: number;
  idCategoria: number;
  enunciado: string;
  tipoPergunta: TipoPergunta;
  peso: number;
  feedbackCorreto?: string;
  feedbackErrado?: string;
  gabaritoTexto?: string;
  idProfessor: number;

  constructor() {
    this.id = 0;
    this.idCategoria = 0;
    this.enunciado = '';
    this.tipoPergunta = 'DISSERTATIVA';
    this.peso = 1.0;
    this.idProfessor = 0;
  }
}