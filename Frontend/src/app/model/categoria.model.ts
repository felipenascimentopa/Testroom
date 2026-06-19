export class CategoriaModel {
  id: number;
  nome: string;
  idProfessor: number;
  idCategoriaPai?: number; 

  constructor() {
    this.id = 0;
    this.nome = '';
    this.idProfessor = 0;
  }
}