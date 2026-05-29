import { Component, OnInit } from '@angular/core';
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
export class ResetPasswordComponent implements OnInit {

  newPassword = '';
  confirmPassword = '';
  loading = false;

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

async ngOnInit() {
  const fullHash = window.location.href;
  
  
  const match = fullHash.match(/access_token=([^&]+)/);
  const refreshMatch = fullHash.match(/refresh_token=([^&]+)/);

  const accessToken = match ? match[1] : null;
  const refreshToken = refreshMatch ? refreshMatch[1] : null;

  console.log('Access token:', accessToken);
  console.log('Refresh token:', refreshToken);

  if (accessToken && refreshToken) {
    const { data, error } = await this.supabase.client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    console.log('Sesión seteada:', data);
    console.log('Error sesión:', error);
  } else {
    console.log('No se encontraron tokens');
  }
}

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