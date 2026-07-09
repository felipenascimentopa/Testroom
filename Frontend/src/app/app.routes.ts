import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'cadastro', loadComponent: () => import('./pages/cadastro/cadastro.page').then(m => m.CadastroPage) },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu/menu.page').then(m => m.MenuPage),
    children: [
      { path: '', redirectTo: 'minhas-turmas', pathMatch: 'full' },
      { path: 'minhas-turmas', loadComponent: () => import('./pages/minhas-turmas/minhas-turmas.page').then(m => m.MinhasTurmasPage) },
      { path: 'criar-turma', loadComponent: () => import('./pages/criar-turma/criar-turma.page').then(m => m.CriarTurmaPage) },
      { path: 'entrar-turma', loadComponent: () => import('./pages/entrar-turma/entrar-turma.page').then(m => m.EntrarTurmaPage) },
      { path: 'detalhes-turma/:id', loadComponent: () => import('./pages/turma-detalhe/turma-detalhe.page').then(m => m.TurmaDetalhePage) },
      { path: 'criar-atividade/:turmaId', loadComponent: () => import('./pages/criar-atividade/criar-atividade.page').then(m => m.CriarAtividadePage) },
      { path: 'resultado-atividade/:id', loadComponent: () => import('./pages/resultado-atividade/resultado-atividade.page').then(m => m.ResultadoAtividadePage) }, 
      { path: 'gerenciar-questoes/:atividadeId', loadComponent: () => import('./pages/gerenciar-questoes/gerenciar-questoes.page').then(m => m.GerenciarQuestoesPage) },
      { path: 'responder-atividade/:id', loadComponent: () => import('./pages/responder-atividade/responder-atividade.page').then(m => m.ResponderAtividadePage) },
      { path: 'selecionar-questoes-banco/:atividadeId', loadComponent: () => import('./pages/selecionar-questoes-banco/selecionar-questoes-banco.page').then(m => m.SelecionarQuestoesBancoPage) },
      { path: 'categorias', loadComponent: () => import('./pages/categorias/categorias.page').then(m => m.CategoriasPage) },
      { path: 'banco-questoes', loadComponent: () => import('./pages/banco-questoes/banco-questoes.page').then(m => m.BancoQuestoesPage) },
      { path: 'meus-resultados', loadComponent: () => import('./pages/meus-resultados/meus-resultados.page').then(m => m.MeusResultadosPage) }
    ]
  }
];