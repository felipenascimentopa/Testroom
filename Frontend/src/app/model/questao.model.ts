export type TipoPergunta = 'DISSERTATIVA' | 'NUMERICA' | 'VF' | 'MULTIPLA_ESCOLHA' | 'UNICA_ESCOLHA';

export class QuestaoModel {
  id: number;
  idAtividade: number;
  idCategoria: number;
  enunciado: string;
  tipoPergunta: TipoPergunta;
  peso: number;
  feedbackCorreto?: string;
  feedbackErrado?: string;
  gabaritoTexto?: string;

  constructor() {
    this.id = 0;
    this.idAtividade = 0;
    this.idCategoria = 0;
    this.enunciado = '';
    this.tipoPergunta = 'DISSERTATIVA';
    this.peso = 1.0;
  }
}