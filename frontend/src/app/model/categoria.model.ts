export class CategoriaModel {
    id?: number;
    nome: string = '';
    descricao?: string = '';
    criadorId?: number;
    criadorNome?: string;     
    criadorFoto?: string;  
    compartilhadaComIds?: number[];
    compartilhadaComNomes?: string[];
}