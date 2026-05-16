import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'lists',
    loadComponent: () => import('./pages/lists/lists.component').then(m => m.ListsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'activity',
    loadComponent: () => import('./pages/activity/activity.component').then(m => m.ActivityComponent),
    canActivate: [authGuard]
  },
  {
    path: 'items',
    loadComponent: () => import('./pages/items/items.component').then(m => m.ItemsComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];
