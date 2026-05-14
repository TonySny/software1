import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';

export const routes: Routes = [
  { path: '', component: LoginComponent }
];
