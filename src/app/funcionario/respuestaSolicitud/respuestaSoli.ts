import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-solicitud',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './respuestaSoli.html',
  styleUrl: './respuestaSoli.scss',
})
export class DetalleSolicitudComponent implements OnInit {

  solicitud: any = null;
  respuesta = '';
  estado = 'recibida';
  guardando = false;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.volver(); return; }
    await this.cargarSolicitud(id);
  }

  async cargarSolicitud(id: string) {
    const { data, error } = await this.supabase.client
      .from('pqrs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      Swal.fire('Error', 'No se pudo cargar la solicitud', 'error');
      this.volver();
      return;
    }

    this.solicitud = data;
    this.respuesta = data.respuesta ?? '';
    this.estado = data.estado ?? 'recibida';
  }

  async confirmar() {
    if (!this.respuesta.trim()) {
      Swal.fire('Campo requerido', 'Debes escribir una respuesta antes de confirmar', 'warning');
      return;
    }

    this.guardando = true;

    const { error } = await this.supabase.client
      .from('pqrs')
      .update({
        respuesta: this.respuesta,
        estado: this.estado
      })
      .eq('id', this.solicitud.id);

    if (error) {
      Swal.fire('Error', 'No se pudo guardar la respuesta', 'error');
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'La respuesta y el estado han sido actualizados.',
        timer: 1800,
        showConfirmButton: false
      });
      setTimeout(() => this.volver(), 1900);
    }

    this.guardando = false;
  }

  volver() {
    this.router.navigate(['/funcionario/solicitudes']);
  }
}