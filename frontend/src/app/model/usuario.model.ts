export class UsuarioModel {
    id?: number;
    email: string = '';
    senha?: string = '';
    cargo: string = 'PROFESSOR';
    professorId?: number;
    professorNome?: string;
    foto?: string; 
}