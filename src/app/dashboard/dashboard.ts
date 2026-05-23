import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {

  nombreUsuario = '';
  isLoggingOut = false;

  constructor(
    private router: Router,
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const session = await this.supabase.getSession();
    if (!session.data.session) {
      this.router.navigate(['/home']);
      return;
    }
    const user = session.data.session.user;
    const metadata = user.user_metadata || {};
    const nombre = metadata['full_name'];
    const apellido = metadata['full_surname'];
    this.nombreUsuario = [nombre, apellido].filter(Boolean).join(' ') || user.email || 'Usuario';
    this.cdr.detectChanges();
  }

  async logout() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#870fa2',
    });

    if (!result.isConfirmed) return;

    this.isLoggingOut = true;

    const { error } = await this.supabase.signOut();
    if (error) {
      this.isLoggingOut = false;
      Swal.fire('Error', 'No se pudo cerrar sesión', 'error');
      return;
    }
    this.router.navigate(['/']);
  }

  /*
  async consultarNombre() {
    const { data: authData, error: authError } = await this.supabase.client
      .from('profiles')
      .select('name')
      .eq('id', `${(await this.supabase.getSession()).data.session?.user.id}`)

    if (authError) {
      return { data: null, error: authError }
    }
    
    return { authData, authError }
  }*/
}