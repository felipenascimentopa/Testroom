export interface AtividadeRequest {
    titulo: string;
    descricao?: string;
    instrucoes?: string;
    quantidade: number;
    categoriaIds?: number[];
}

export interface AtividadeResponse {
    id: number;
    titulo: string;
    descricao?: string;
    instrucoes?: string;
    valorPontos: number;
    professorId: number;
    professorNome: string;
    dataGeracao: string;
    questoes: QuestaoAtividade[];
}

export interface QuestaoAtividade {
    questaoId: number;
    enunciado: string;
    posicao: number;
    valorPontos: number;
    alternativas: AlternativaVisualizacao[];
}

export interface AlternativaVisualizacao {
    id: number;
    texto: string;
}