import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { DashboardComponent } from './dashboard/dashboard';
import { PeticionesComponent } from './home/pages/peticiones/peticiones';
import { QuejasComponent } from './home/pages/quejas/quejas';
import { ReclamosComponent } from './home/pages/reclamos/reclamos';
import { SugerenciasComponent } from './home/pages/sugerencias/sugerencias';
import { ConsultarComponent } from './home/consultar/consultar';
import { MisPqrsComponent } from './home/mis-pqrs/mis-pqrs';
import { ResetPasswordComponent } from './reset-password/reset.password';
import { AdminComponent } from './admin/admin';
import { UsuariosComponent } from './admin/usuarios/usuarios';
import { FuncionarioComponent } from './funcionario/funcionario';
import { SolicitudesComponent } from './funcionario/solicitudes/solicitudes';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'peticiones', component: PeticionesComponent },
  { path: 'quejas', component: QuejasComponent },
  { path: 'reclamos', component: ReclamosComponent },
  { path: 'sugerencias', component: SugerenciasComponent },
  { path: 'consultar', component: ConsultarComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/usuarios', component: UsuariosComponent },
  { path: 'funcionario', component: FuncionarioComponent },
  { path: 'funcionario/solicitudes', component: SolicitudesComponent },
  { path: 'mis-pqrs', component: MisPqrsComponent }
];
