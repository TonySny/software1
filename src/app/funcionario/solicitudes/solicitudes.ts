import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './solicitudes.html',
  styleUrls: ['./solicitudes.scss']
})
export class SolicitudesComponent implements OnInit {

  solicitudes: any[] = [];
  selectedSolicitud: any = null;
  respuesta = '';
  modalOpen = false;

  remitente: any = null;

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarSolicitudes();
  }
  
  async openModal(solicitud: any) {
    this.modalOpen = true;
    this.selectedSolicitud = solicitud;
    await this.consultarRemitente(solicitud.profile_id);
    
    this.cdr.detectChanges();
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedSolicitud = null;
    this.respuesta = '';
    this.remitente = null

    // document.body.style.overflow = 'auto';
  }

  async cargarSolicitudes() {
    const { data, error } = await this.supabase.client
    .from('requests')
    .select('*')
    .eq('func_id', `${await this.supabase.getSession()}`);
    /**
     * CAMBIAR AQUÍ NO OLVIDAR 🗣️🗣️🗣️🗣️🗣️🗣️🗣️🗣️🗣️
     * .eq('func_id', `${await this.supabase.getSession()}`)
     */

    if (error) {
      Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
      return;
    }

    if (data.length == 0) {
      Swal.fire('Error', 'No se encontraron solicitudes asignadas', 'error');
      return;
    }

    this.solicitudes = data || [];
    this.cdr.markForCheck();
  }

  async consultarRemitente(id: string) {
    this.remitente = await this.supabase.getUserEQ(id);
  }

  async responder(solicitud: any, respuesta: string) {
    if (!respuesta?.trim()) {
      Swal.fire('Campo vacío', 'Escribe una respuesta antes de enviar.', 'warning');
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: '¿Enviar respuesta?',
      html: `<p style="text-align:left">Radicado: <strong>${solicitud.ref_number}</strong></p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4f46e5',
    });

    if (!isConfirmed) return;

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
      .update({ status: 'Solucionada' })
      .eq('id', solicitud.id);

    Swal.fire('Enviado ✓', 'Respuesta enviada correctamente.', 'success');
    this.closeModal();
    await this.cargarSolicitudes();
  }
}