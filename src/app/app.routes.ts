import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { DashboardComponent } from './dashboard/dashboard';
import { PeticionesComponent } from './home/peticiones/peticiones';
import { QuejasComponent } from './home/quejas/quejas';
import { ReclamosComponent } from './home/reclamos/reclamos';
import { SugerenciasComponent } from './home/sugerencias/sugerencias';
import { ConsultarComponent } from './home/consultar/consultar';
import { ResetPasswordComponent } from './reset-password/reset.password';
import { GestionarUsuariosComponent } from './admin/gestionarUsuarios/gesUser';
import { AsignarSolicitudesComponent } from './admin/asignarSolicitudes/asigSolis';
import { FuncionarioComponent } from './funcionario/funcionario';
import { VerSolicitudesComponent } from './funcionario/verSolicitudes/verSolis';
import { DetalleSolicitudComponent } from './funcionario/respuestaSolicitud/respuestaSoli';

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
  { path: 'admin/usuarios', component: GestionarUsuariosComponent },
  { path: 'admin/solicitudes', component: AsignarSolicitudesComponent },
  { path: 'funcionario', component: FuncionarioComponent },
  { path: 'funcionario/solicitudes', component: VerSolicitudesComponent },
  { path: 'funcionario/solicitudes/:id', component: DetalleSolicitudComponent }
];