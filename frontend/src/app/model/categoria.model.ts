export class CategoriaModel {
    id?: number;
    nome: string = '';
    descricao?: string = '';
    criadorId?: number;
    compartilhadaComIds?: number[];  
}