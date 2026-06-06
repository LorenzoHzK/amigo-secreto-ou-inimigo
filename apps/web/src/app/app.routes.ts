import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'criar',
    loadComponent: () =>
      import('./features/create-group/create-group.page').then(
        (m) => m.CreateGroupPage,
      ),
  },
  {
    path: 'admin/:adminToken',
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
