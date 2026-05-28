import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss']
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  roles: any[] = [];
  rolesOriginales: { [id: string]: any } = {};
  guardando = false;

  constructor(
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await Promise.all([this.cargarRoles(), this.cargarUsuarios()]);
  }

  async cargarRoles() {
    const { data, error } = await this.supabase.client
      .from('profile_roles')
      .select('id, name');
    if (!error) this.roles = data || [];
  }

  async cargarUsuarios() {
    const { data: perfiles, error: errorPerfiles } = await this.supabase.client
      .rpc('get_all_profiles');

    if (errorPerfiles) {
      Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      return;
    }

    this.usuarios = perfiles || [];
    this.usuarios.forEach(u => {
      this.rolesOriginales[u.id] = u.role_id;
    });

    this.cdr.markForCheck();
  }

  async guardarCambios() {
    const modificados = this.usuarios.filter(u => u.role_id !== this.rolesOriginales[u.id]);

    if (modificados.length === 0) {
      Swal.fire('Sin cambios', 'No has modificado ningún rol.', 'info');
      return;
    }

    this.guardando = true;
    this.cdr.markForCheck();
    const errores: string[] = [];

    for (const usuario of modificados) {
      const { error } = await this.supabase.client
        .from('profiles')
        .update({ role_id: usuario.role_id })
        .eq('id', usuario.id);

      if (error) {
        errores.push(usuario.name ?? usuario.id);
      } else {
        this.rolesOriginales[usuario.id] = usuario.role_id;
      }
    }

    this.guardando = false;
    this.cdr.markForCheck();

    if (errores.length > 0) {
      Swal.fire('Error parcial', `No se pudo actualizar: ${errores.join(', ')}`, 'warning');
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: `Se actualizaron ${modificados.length} usuario(s) correctamente.`,
        timer: 1800,
        showConfirmButton: false
      });
    }
  }
}