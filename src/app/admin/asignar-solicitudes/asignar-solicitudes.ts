import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-solicitudes',
  imports: [CommonModule, FormsModule],
  templateUrl: './asignar-solicitudes.html',
  styleUrls: ['./asignar-solicitudes.scss']
})
export class AsignarSolicitudesComponent implements OnInit {

  solicitudes: any[] = [];
  funcionarios: any[] = [];

  constructor(
    private supabase: SupabaseService,
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
      .eq('status', 'Radicada');

    if (error) {
      console.error(error);
      return;
    }

    this.solicitudes = data || [];
    this.cdr.detectChanges();
  }

  async cargarFuncionarios() {

    // 1. Obtener el rol "Funcionario"
    const { data: rol, error: errorRol } = await this.supabase.client
      .from('profile_roles')
      .select('id')
      .eq('name', 'Funcionario')
      .single();

    if (errorRol) {
      console.error('Error obteniendo rol:', errorRol);
      return;
    }

    // 2. Buscar perfiles con ese role_id
    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('*')
      .eq('role_id', rol.id);

    if (error) {
      console.error('Error obteniendo funcionarios:', error);
      return;
    }

    this.funcionarios = data || [];
    console.log(data)
    this.cdr.detectChanges();
  }

  async asignarSolicitud(solicitud: any) {

    if (!solicitud.func_id) {
      Swal.fire('error', 'Seleccione un funcionario', 'error');
      return;
    }

    const { error } = await this.supabase.client
      .from('requests')
      .update({
        func_id: solicitud.func_id,
        status: 'Asignada en area' // cambia estado
      })
      .eq('id', solicitud.id);



    // AQUÍ LUEGO LLAMAR FUNCIÓN NOTIFICACIÓN USUARIO

    if (error) {
      Swal.fire('Error','Error al asignar '+error,'error');
      return;
    }

    Swal.fire('¡Asignada en area!','Solicitud asignada correctamente a un funcionario','success');

    await this.cargarSolicitudes();
  }

}
