import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-usuarios',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './gesUser.html',
  styleUrl: './gesUser.scss',
})
export class GestionarUsuariosComponent implements OnInit {

  usuarios: any[] = [];
  cargando = true;

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.cargando = true;
    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
    } else {
      this.usuarios = data ?? [];
    }
    this.cargando = false;
  }

  async cambiarRol(usuario: any) {
    const { error } = await this.supabase.client
      .from('profiles')
      .update({ rol: usuario.rol })
      .eq('id', usuario.id);

    if (error) {
      Swal.fire('Error', 'No se pudo actualizar el rol', 'error');
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Rol actualizado',
        text: `${usuario.full_name} ahora es ${usuario.rol}`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}