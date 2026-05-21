import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class DashboardComponent implements OnInit {
 
  nombreAdmin = 'Admin';
 
  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}
 
  async ngOnInit() {
    const { data } = await this.supabase.getSession();
    if (!data.session) {
      this.router.navigate(['/']);
      return;
    }
    const user = data.session.user;
    const nombre = user.user_metadata?.['full_name'];
    if (nombre) this.nombreAdmin = nombre;
  }
 
  irA(ruta: string) {
    this.router.navigate([ruta]);
  }
 
  editarPerfil() {
    // Navegar a pantalla de edición de perfil
    this.router.navigate(['/admin/perfil']);
  }
 
  async logout() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#870fa2',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, salir'
    });
 
    if (result.isConfirmed) {
      await this.supabase.signOut();
      this.router.navigate(['/']);
    }
  }
}
 