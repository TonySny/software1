import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes.html',
  styleUrls: ['./solicitudes.scss']
})

export class SolicitudesComponent implements OnInit {

  solicitudes: any[] = [];
  solicitudSeleccionada: any = null;
  solicitudResponder: any = null;
  textoRespuesta: string = '';

  constructor(
    private supabase: SupabaseService, 
    private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.cargarSolicitudes();
  }

  async cargarSolicitudes() {
    const { data, error } = await this.supabase.client
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
      return;
    }

    this.solicitudes = data || [];
    this.cdr.markForCheck();
  }

  verDetalle(solicitud: any) {
    Swal.fire({
      title: '📋 Detalle de solicitud',
      html: `
        <div style="text-align:left; display:grid; grid-template-columns:1fr 1fr; gap:12px 24px;">
          <div><strong>Radicado</strong><br>${solicitud.ref_number}</div>
          <div><strong>Tipo</strong><br>${solicitud.type}</div>
          <div><strong>Estado</strong><br>${solicitud.status}</div>
          <div><strong>Destino</strong><br>${solicitud.destination}</div>
          <div><strong>Email</strong><br>${solicitud.email || '—'}</div>
          <div><strong>Teléfono</strong><br>${solicitud.phone}</div>
          <div><strong>Fecha</strong><br>${new Date(solicitud.created_at).toLocaleDateString('es-CO')}</div>
          <div style="grid-column:1/-1"><strong>Descripción</strong><br>${solicitud.request}</div>
        </div>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#7b1fa2',
      width: 600,
    });
  }

  async responder(solicitud: any) {
    const { value: respuesta, isConfirmed } = await Swal.fire({
      title: '💬 Responder solicitud',
      html: `<p style="text-align:left; margin-bottom:8px;">Radicado: <strong>${solicitud.ref_number}</strong></p>`,
      input: 'textarea',
      inputPlaceholder: 'Escribe la respuesta...',
      inputAttributes: { rows: '5' },
      showCancelButton: true,
      confirmButtonText: 'Enviar respuesta',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#7b1fa2',
      inputValidator: (value) => {
        if (!value?.trim()) return 'Escribe una respuesta antes de enviar';
        return undefined;
      }
    });

    if (!isConfirmed || !respuesta?.trim()) return;

    const { error } = await this.supabase.client
      .from('request_responses')
      .insert({
        request_id: solicitud.id,
        response: respuesta.trim(),
      });

    if (error) {
      Swal.fire('Error', 'No se pudo enviar la respuesta: ' + error.message, 'error');
      return;
    }

    await this.supabase.client
      .from('requests')
      .update({ status: 'Respondida' })
      .eq('id', solicitud.id);

    Swal.fire('Enviado', 'Respuesta enviada correctamente', 'success');
    await this.cargarSolicitudes();
  }
}