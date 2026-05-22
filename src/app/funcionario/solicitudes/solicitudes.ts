import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes.html',
  styleUrls: ['./solicitudes.css']
})
export class SolicitudesComponent implements OnInit {

  solicitudes: any[] = [];

  constructor(
    private supabase: SupabaseService
  ) {}

  async ngOnInit() {
    await this.cargarSolicitudes();
  }

  async cargarSolicitudes() {
  const { data, error } = await this.supabase.client
    .from('requests')  // ← era 'request'
    .select('*');

  if (error) {
    Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
    return;
  }

  this.solicitudes = data || [];
}

async responderSolicitud(solicitud: any) {
  const { error } = await this.supabase.client
    .from('requests')  // ← era 'request'
    .update({
      response: solicitud.response,
      status: 'Respondida'
    })
    .eq('id', solicitud.id);

  if (error) {
    Swal.fire('Error', 'No se pudo enviar la respuesta', 'error');
    return;
  }

  Swal.fire('Éxito', 'Solicitud respondida correctamente', 'success');
  await this.cargarSolicitudes();
}

}