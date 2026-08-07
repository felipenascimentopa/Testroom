import { TipoQuestao } from './tipo-questao.enum';

export interface Alternativa {
    id?: number;
    texto: string;
    verdadeira: boolean;
}

export class QuestaoModel {
    id?: number;
    tipoQuestao: TipoQuestao = TipoQuestao.UNICA_ESCOLHA;
    enunciado: string = '';
    valorPontos: number = 1.0;
    criadoPor?: string = '';
    professorId?: number;
    categoriaIds: number[] = [];
    categorias?: any[] = [];
    alternativas: Alternativa[] = [];
}