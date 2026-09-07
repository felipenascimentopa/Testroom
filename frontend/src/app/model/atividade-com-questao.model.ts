export interface AtividadeComQuestoesRequest {
    titulo: string;
    descricao?: string;
    instrucoes?: string;
    questoes: QuestaoSelecionada[];
    quantidadeVersoes: number;
}

export interface QuestaoSelecionada {
    questaoId: number;
    valorPontos: number;
}