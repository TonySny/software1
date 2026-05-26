import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    // 1. Traer perfiles
    const { data: perfiles, error: errorPerfiles } = await this.supabase.client
      .from('profiles')
      .select('id, name, surname, role_id')
      .order('name', { ascending: true });

    if (errorPerfiles) {
      Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      return;
    }

    // 2. Para cada perfil, buscar el request más reciente con su email y phone
    const usuariosConDatos = await Promise.all(
      (perfiles || []).map(async (perfil: any) => {
        const { data: req } = await this.supabase.client
          .from('requests')
          .select('email, phone')
          .eq('profile_id', perfil.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        return {
          ...perfil,
          email: req?.email ?? '—',
          phone: req?.phone ?? '—',
        };
      })
    );

    this.usuarios = usuariosConDatos;

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