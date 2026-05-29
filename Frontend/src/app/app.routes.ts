import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
    },
    {
        path: 'menu',
        loadComponent: () => import('./pages/menu/menu.page').then(m => m.MenuPage),
        children: [
            {
                path: '',
                redirectTo: 'minhas-turmas',
                pathMatch: 'full'
            },
            {
                path: 'minhas-turmas',
                loadComponent: () => import('./pages/minhas-turmas/minhas-turmas.page').then(m => m.MinhasTurmasPage)
            },
            {
                path: 'criar-turma',
                loadComponent: () => import('./pages/criar-turma/criar-turma.page').then(m => m.CriarTurmaPage)
            },
            {
                path: 'editar-turma/:id',
                loadComponent: () => import('./pages/criar-turma/criar-turma.page').then(m => m.CriarTurmaPage)
            },
            {
                path: 'entrar-turma',
                loadComponent: () => import('./pages/entrar-turma/entrar-turma.page').then(m => m.EntrarTurmaPage)
            },
            
        ]
    },
    {
        path: 'turma-detalhe/:id',
        loadComponent: () => import('./pages/turma-detalhe/turma-detalhe.page').then(m => m.TurmaDetalhePage)
    },
    
  {
    path: 'minhas-turmas',
    loadComponent: () => import('./pages/minhas-turmas/minhas-turmas.page').then( m => m.MinhasTurmasPage)
  },
  {
    path: 'turma-detalhe',
    loadComponent: () => import('./pages/turma-detalhe/turma-detalhe.page').then( m => m.TurmaDetalhePage)
  },
  {
    path: 'criar-turma',
    loadComponent: () => import('./pages/criar-turma/criar-turma.page').then( m => m.CriarTurmaPage)
  },
  {
    path: 'entrar-turma',
    loadComponent: () => import('./pages/entrar-turma/entrar-turma.page').then( m => m.EntrarTurmaPage)
  },  {
    path: 'alunos',
    loadComponent: () => import('./pages/alunos/alunos.page').then( m => m.AlunosPage)
  }


];