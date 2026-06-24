import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'registrar',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'criar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/create-group/create-group.page').then(
        (m) => m.CreateGroupPage,
      ),
  },
  {
    path: 'admin/:adminToken',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin.page').then((m) => m.AdminPage),
  },
  {
    path: 'entrar/:inviteToken',
    loadComponent: () =>
      import('./features/join/join.page').then((m) => m.JoinPage),
  },
  {
    path: 'grupos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/groups/groups.page').then((m) => m.GroupsPage),
  },
  {
    path: 'revelar/:personalToken',
    loadComponent: () =>
      import('./features/reveal/reveal.page').then((m) => m.RevealPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
