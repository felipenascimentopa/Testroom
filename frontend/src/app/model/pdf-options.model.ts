export interface PdfOptions {
  manterQuestoesJuntas: boolean;
  mostrarDescricao: boolean;
  mostrarInstrucoes: boolean;
  mostrarData: boolean;
  mostrarTotalPontos: boolean;
  mostrarPontosPorQuestao: boolean;
  mostrarFotos: boolean;
  tamanhoFonteTitulo: number;
  tamanhoFonteEnunciado: number;
  tamanhoFonteAlternativa: number;
  espacamentoEntreQuestoes: number;
  margemPagina: number;
}

export const PDF_OPTIONS_PADRAO: PdfOptions = {
  manterQuestoesJuntas: true,
  mostrarDescricao: true,
  mostrarInstrucoes: true,
  mostrarData: true,
  mostrarTotalPontos: true,
  mostrarPontosPorQuestao: true,
  mostrarFotos: true,
  tamanhoFonteTitulo: 18,
  tamanhoFonteEnunciado: 12,
  tamanhoFonteAlternativa: 11,
  espacamentoEntreQuestoes: 10,
  margemPagina: 36
};