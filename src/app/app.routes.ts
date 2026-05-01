/* rutas */

import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { HomeComponent } from './home/home';

import { PeticionesComponent } from './home/peticiones/peticiones';
import { QuejasComponent } from './home/quejas/quejas';
import { ReclamosComponent } from './home/reclamos/reclamos';
import { SugerenciasComponent } from './home/sugerencias/sugerencias';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },

  { path: 'peticiones', component: PeticionesComponent },
  { path: 'quejas', component: QuejasComponent },
  { path: 'reclamos', component: ReclamosComponent },
  { path: 'sugerencias', component: SugerenciasComponent }
];
