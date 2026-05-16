import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'lists',
        loadComponent: () => import('./pages/lists/lists.component').then(m => m.ListsComponent)
      },
      {
        path: 'activity',
        loadComponent: () => import('./pages/activity/activity.component').then(m => m.ActivityComponent)
      },
      {
        path: 'items',
        loadComponent: () => import('./pages/items/items.component').then(m => m.ItemsComponent)
      },
      {
        path: 'schedule',
        loadComponent: () => import('./pages/schedule/schedule.component').then(m => m.ScheduleComponent)
      },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
