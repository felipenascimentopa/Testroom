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