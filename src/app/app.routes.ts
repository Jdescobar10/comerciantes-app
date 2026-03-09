import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'merchants',
    canActivate: [authGuard],
    loadComponent: () => import('./features/merchants/pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'merchants/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/merchants/pages/form/form.component').then(m => m.FormComponent)
  },
  {
    path: 'merchants/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/merchants/pages/form/form.component').then(m => m.FormComponent)
  },
  { path: '**', redirectTo: 'login' }
];