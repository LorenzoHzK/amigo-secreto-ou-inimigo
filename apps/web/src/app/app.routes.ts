import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { adminTokenGuard } from './core/guards/admin-token.guard';
import { inviteTokenGuard } from './core/guards/invite-token.guard';
import { revealResolver } from './core/resolvers/reveal.resolver';

export const routes: Routes = [
  // Página inicial (landing) — pública para anônimos.
  // Usuário autenticado é redirecionado para /grupos (guestGuard);
  // para rever a landing, basta deslogar.
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/home/home.page').then(m => m.HomePage),
  },

  // Auth — apenas para usuários não autenticados
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.page').then(m => m.LoginPage),
  },
  {
    path: 'registrar',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register.page').then(m => m.RegisterPage),
  },

  // Painel do organizador — protegido por adminTokenGuard (não por sessão)
  {
    path: 'admin/:adminToken',
    canActivate: [adminTokenGuard],
    loadComponent: () => import('./features/admin/admin.page').then(m => m.AdminPage),
  },

  // Entrada de participante — protegida por inviteTokenGuard
  {
    path: 'entrar/:inviteToken',
    canActivate: [inviteTokenGuard],
    loadComponent: () => import('./features/join/join.page').then(m => m.JoinPage),
  },

  // Área "/grupos" — rotas filhas sob um layout pai (hierarquia de layout).
  // O filho '' (lista) exige autenticação; o filho 'criar' é público.
  {
    path: 'grupos',
    loadComponent: () =>
      import('./features/groups/groups-shell.component').then(m => m.GruposShellComponent),
    children: [
      {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./features/groups/groups.page').then(m => m.GroupsPage),
      },
      {
        path: 'criar',
        loadComponent: () =>
          import('./features/create-group/create-group.page').then(m => m.CreateGroupPage),
      },
    ],
  },

  // Revelação — pública (token é o passaporte). Resolver pré-carrega o par.
  {
    path: 'revelar/:personalToken',
    resolve: { resolvedDraw: revealResolver },
    loadComponent: () => import('./features/reveal/reveal.page').then(m => m.RevealPage),
  },

  // Página informativa: grupo já sorteado
  {
    path: 'grupo-encerrado',
    loadComponent: () =>
      import('./features/group-closed/group-closed.page').then(m => m.GroupClosedPage),
  },

  // 404 real
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.page').then(m => m.NotFoundPage),
  },
];
