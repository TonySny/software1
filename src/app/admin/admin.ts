import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent implements OnInit {

  nombreAdmin = 'Administrador';

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const session = await this.supabase.getSession();
    if (!session.data.session) {
      this.router.navigate(['/home']);
      return;
    }

    const userId = session.data.session.user.id;

    // Intentar obtener nombre desde user_metadata primero
    const metadata = session.data.session.user.user_metadata || {};
    const nombreMeta = [metadata['full_name'], metadata['full_surname']]
      .filter(Boolean).join(' ');

    if (nombreMeta) {
      this.nombreAdmin = nombreMeta;
      this.cdr.detectChanges();
      return;
    }

    // Si no hay metadata, consultar desde profiles
    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('name, surname')
      .eq('id', userId)
      .single();

    if (!error && data) {
      this.nombreAdmin = [data.name, data.surname].filter(Boolean).join(' ')
        || session.data.session.user.email
        || 'Administrador';
    } else {
      this.nombreAdmin = session.data.session.user.email || 'Administrador';
    }

    this.cdr.detectChanges();
  }

  async logout() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#870fa2',
      cancelButtonColor: '#aaa'
    });

    if (result.isConfirmed) {
      await this.supabase.signOut();
      this.router.navigate(['/']);
    }
  }

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }
}