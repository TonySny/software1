import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { DashboardComponent } from './dashboard/dashboard';
import { PeticionesComponent } from './home/peticiones/peticiones';
import { QuejasComponent } from './home/quejas/quejas';
import { ReclamosComponent } from './home/reclamos/reclamos';
import { SugerenciasComponent } from './home/sugerencias/sugerencias';
import { ConsultarComponent } from './home/consultar/consultar';
import { ResetPasswordComponent } from './reset-password/reset.password';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'peticiones', component: PeticionesComponent },
  { path: 'quejas', component: QuejasComponent },
  { path: 'reclamos', component: ReclamosComponent },
  { path: 'sugerencias', component: SugerenciasComponent },
  { path: 'consultar', component: ConsultarComponent },
  { path: 'reset-password', component: ResetPasswordComponent }
];