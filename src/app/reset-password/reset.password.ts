import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset.password.html',
  styleUrls: ['./reset.password.scss']
})
export class ResetPasswordComponent {

  newPassword = '';
  confirmPassword = '';
  loading = false;

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async resetPassword() {
    if (!this.newPassword || !this.confirmPassword) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (this.newPassword.length < 8) {
      Swal.fire('Error', 'La contraseña debe tener mínimo 8 caracteres', 'error');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    this.loading = true;
    try {
      const { error } = await this.supabase.client.auth.updateUser({
        password: this.newPassword
      });

      if (error) {
        Swal.fire('Error', 'No se pudo actualizar la contraseña', 'error');
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Contraseña actualizada!',
          text: 'Ya puedes iniciar sesión con tu nueva contraseña.',
          confirmButtonColor: '#870fa2'
        });
        setTimeout(() => this.router.navigate(['']), 2000);
      }
    } catch {
      Swal.fire('Error', 'Ocurrió un error inesperado', 'error');
    } finally {
      this.loading = false;
    }
  }
}