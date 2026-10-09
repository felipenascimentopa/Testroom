export interface CompartilhamentoPendente {
    id: number;
    categoriaId: number;
    categoriaNome: string;
    categoriaDescricao?: string;
    origemId: number;
    origemNome: string;
    origemEspecialidade?: string;
    origemFoto?: string;
    dataCompartilhamento: string;
}

export interface CompartilhamentoCategoria {
    id: number;
    categoriaId: number;
    origemId: number;
    origemNome: string;
    destinoId: number;
    destinoNome: string;
    destinoFoto?: string;
    status: 'PENDENTE' | 'ACEITO' | 'RECUSADO';
    dataCompartilhamento: string;
}