import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', redirectTo: 'login', pathMatch: 'full' 
  },
  { 
    path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) 
  },
  { 
    path: 'cadastro', loadComponent: () => import('./pages/cadastro/cadastro.page').then(m => m.CadastroPage) 
  },
  { 
    path: 'menu', loadComponent: () => import('./pages/menu/menu.page').then(m => m.MenuPage) 
  },
  { 
    path: 'categorias', loadComponent: () => import('./pages/categoria/categoria.page').then(m => m.CategoriaPage) 
  },
  { 
    path: 'categoria-form', loadComponent: () => import('./pages/categoria-form/categoria-form.page').then(m => m.CategoriaFormPage) 
  },
  { 
    path: 'categoria-form/:id', loadComponent: () => import('./pages/categoria-form/categoria-form.page').then(m => m.CategoriaFormPage) 
  },
  { 
    path: 'questoes', loadComponent: () => import('./pages/questao/questao.page').then(m => m.QuestaoPage) 
  },
  { 
    path: 'questao-form', loadComponent: () => import('./pages/questao-form/questao-form.page').then(m => m.QuestaoFormPage) 
  },
  { 
    path: 'questao-form/:id', loadComponent: () => import('./pages/questao-form/questao-form.page').then(m => m.QuestaoFormPage) 
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
  { 
  path: 'perfil', 
  loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage) 
},
];