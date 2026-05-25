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
        path: 'items',
        loadComponent: () => import('./pages/items/items.component').then(m => m.ItemsComponent)
      },
      {
        path: 'activity',
        loadComponent: () => import('./pages/activity/activity.component').then(m => m.ActivityComponent)
      },
      {
        path: 'schedule',
        loadComponent: () => import('./pages/schedule/schedule.component').then(m => m.ScheduleComponent)
      },
      {
        path: 'workday',
        loadComponent: () => import('./pages/workday/workday.component').then(m => m.WorkdayComponent)
      },
      {
        path: 'attendance',
        loadComponent: () => import('./pages/attendance/attendance.component').then(m => m.AttendanceComponent)
      },
      {
        path: 'workforce',
        loadComponent: () => import('./pages/workforce/workforce.component').then(m => m.WorkforceComponent)
      },
      {
        path: 'live-status',
        loadComponent: () => import('./pages/live-status/live-status.component').then(m => m.LiveStatusComponent)
      },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
