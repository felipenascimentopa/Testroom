import { Routes } from '@angular/router';

export const routes: Routes = [
     {
          path: '',
          redirectTo: 'login',
          pathMatch: 'full',
     },
     {
          path: 'menu',
          loadComponent: () => import('./pages/menu/menu.page').then(m => m.MenuPage)
     },
     {
          path: 'login',
          loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
     },
     {
          path: 'add-usuario',
          loadComponent: () => import('./pages/add-usuario/add-usuario.page').then(m => m.AddUsuarioPage)
     },
     {
          path: 'usuario',
          loadComponent: () => import('./pages/usuario/usuario.page').then(m => m.UsuarioPage)
     },
];
