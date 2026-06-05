import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';
import { NotificationService } from '../../services/notification.service';

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
  
  reclasificacionOpen = false;
  nuevaClasificacion = '';

  constructor(
    private supabase: SupabaseService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarSolicitudes();
  }

  openReclasificacion() {
    this.nuevaClasificacion = this.selectedSolicitud?.clasificacion_funcionario ?? '';
    this.reclasificacionOpen = true;
  }

  closeReclasificacion() {
    this.reclasificacionOpen = false;
    this.nuevaClasificacion = '';
  }

  async guardarReclasificacion(solicitud: any) {
    if (!this.nuevaClasificacion) {
      Swal.fire('Atención', 'Debes seleccionar una clasificación', 'warning');
      return;
    }

    const { error } = await this.supabase.client
      .from('requests')
      .update({
        clasificacion_funcionario: this.nuevaClasificacion,
        pendiente_reclasificacion: false
      })
      .eq('id', solicitud.id);

    if (error) {
      Swal.fire('Error', 'No se pudo guardar la reclasificación', 'error');
      return;
    }

    // Actualizar localmente sin recargar
    solicitud.clasificacion_funcionario = this.nuevaClasificacion;
    solicitud.pendiente_reclasificacion = false;

    // Notificación al ciudadano
    await this.notification.enviar('cambio_clasificacion', solicitud.email, {
      id: solicitud.ref_number,
      nombre: solicitud.nombre ?? solicitud.email,
      clasificacion: this.nuevaClasificacion,
    });

    this.closeReclasificacion();
    Swal.fire('Listo', 'Solicitud reclasificada correctamente', 'success');
    this.cdr.markForCheck();
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
    const { data: Session } = await this.supabase.client.auth.getSession();
    const user = Session.session?.user
    
    const { data, error } = await this.supabase.client
    .from('requests')
    .select('*')
    .eq('func_id', `${user?.id}`);
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

    const solicitudesConArchivos = await Promise.all(
      data.map(async (solicitud: any) => {
        const { data: paths } = await this.supabase.client
          .from('request_paths')
          .select('*')
          .eq('request_id', solicitud.id);

        return { ...solicitud, files: paths ?? [] };
      })
    );


    this.solicitudes = solicitudesConArchivos;
    this.cdr.markForCheck();
  }

  async downloadAllFiles(solicitud: any) {
    if (!solicitud.files || solicitud.files.length === 0) {
      return
    }

    for (const path of solicitud.files) {
      const { data: fileBlob, error } = await this.supabase.client
        .storage
        .from('pqrs files')
        .download(path.filepath);

        console.log('DESCARGÓ')

      if (error) {
        console.error(`Error descargando ${path.filepath}:`, error);
        continue;
      }

      const url = URL.createObjectURL(fileBlob);
      const a = document.createElement('a');

      a.href = url;
      a.download = path.filename ?? path.filepath.split('/').pop();
      a.click();
      URL.revokeObjectURL(url);
    }
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

    // Notificación al ciudadano
    await this.notification.enviar('solicitud_respondida', solicitud.email, {
      id: solicitud.ref_number,
      nombre: solicitud.nombre ?? solicitud.email,
      respuesta: respuesta.trim(),
    });

    Swal.fire('Enviado ✓', 'Respuesta enviada correctamente.', 'success');
    this.closeModal();
    await this.cargarSolicitudes();
  }
}