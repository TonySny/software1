import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-mis-pqrs',
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: './mis-pqrs.html',
    styleUrl: './mis-pqrs.scss'
})
export class MisPqrsComponent implements OnInit {

  solicitudes: any[] = [];
  cargando = true;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      const { data: { user } } = await this.supabase.client.auth.getUser();

      if (!user) {
        this.router.navigate(['']);
        return;
      }

      const { data, error } = await this.supabase.client
        .from('requests')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        Swal.fire('Error', 'No se pudieron cargar tus solicitudes', 'error');
      } else {
        this.solicitudes = data ?? [];
      }

    } catch (err) {
      Swal.fire('Error', 'Error inesperado al cargar', 'error');
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'resuelto': return '#22c55e';
      case 'en proceso': return '#f59e0b';
      default: return '#870fa2';
    }
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}