import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import Swal from 'sweetalert2';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-asignar-solicitudes',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './asignar-solicitudes.html',
  styleUrls: ['./asignar-solicitudes.scss']
})
export class AsignarSolicitudesComponent implements OnInit {

  solicitudes: any[] = [];
  funcionarios: any[] = [];

  constructor(
    private supabase: SupabaseService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarSolicitudes();
    this.cargarFuncionarios();
  }

  async cargarSolicitudes() {
    const { data, error } = await this.supabase.client
      .from('requests')
      .select('*')
      .is('func_id', null);

    if (error) {
      console.error(error);
      return;
    }

    this.solicitudes = data || [];
    this.cdr.detectChanges();
  }

  async cargarFuncionarios() {
    const { data: rol, error: errorRol } = await this.supabase.client
      .from('profile_roles')
      .select('id')
      .eq('name', 'Funcionario')
      .single();

    if (errorRol) {
      console.error('Error obteniendo rol:', errorRol);
      return;
    }

    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('*')
      .eq('role_id', rol.id);

    if (error) {
      console.error('Error obteniendo funcionarios:', error);
      return;
    }

    this.funcionarios = data || [];
    this.cdr.detectChanges();
  }

  async asignarSolicitud(solicitud: any) {
    if (!solicitud.func_id) {
      Swal.fire('Error', 'Seleccione un funcionario', 'error');
      return;
    }

    const { data } = await this.supabase.getSession()
    
    if (!data.session) {
      throw new Error('No hay sesión activa')
    }

    const profile = await this.supabase.getUserEQ(data.session.user.id)

    const { error } = await this.supabase.client
      .from('requests')
      .update({
        func_id: solicitud.func_id,
        status: 'Asignada en area',
        quien_asigno_solicitud: `${profile?.name}` // SI LLEGASEN A HABER ADMINISTRADORES CON NOMBRES PERSONALIZADOS AGREGAR A LA CADENA ${profile?.name}
      })
      .eq('id', solicitud.id);

    if (error) {
      Swal.fire('Error', 'Error al asignar: ' + error.message, 'error');
      return;
    }

    // Notificación al ciudadano
    await this.notification.enviar('cambio_estado', solicitud.email, {
      id: solicitud.ref_number,
      nombre: solicitud.nombre ?? solicitud.email,
      estado: 'Asignada en área',
    });


    Swal.fire('¡Asignada!', 'Solicitud asignada correctamente a un funcionario', 'success');
    await this.cargarSolicitudes();
  }
}