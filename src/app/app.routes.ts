/* rutas */

import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';




export const routes: Routes = [
  { path: '', component: LoginComponent }, // ruta raíz que muestra el componente de login
   { path: 'register', component: RegisterComponent }
];

