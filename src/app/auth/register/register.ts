import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  name = '';
  surname = '';
  tipoDocumento = '';
  numeroDocumento = '';
  sexo = '';
  edad: number | null = null;
  grupoEtnico = '';
  ciudad = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;

  constructor(
    private router: Router,
    private supabase: SupabaseService
  ) {}

  async register() {
    // Validar campos obligatorios
    if (!this.name || !this.surname || !this.tipoDocumento || !this.numeroDocumento ||
        !this.sexo || !this.edad || !this.grupoEtnico || !this.ciudad ||
        !this.email || !this.password || !this.confirmPassword) {
      Swal.fire('Campos incompletos', 'Todos los campos son obligatorios', 'error');
      return;
    }

    // Validar mayor de edad
    if (this.edad < 18) {
      Swal.fire('No permitido', 'El sistema no permite el registro de menores de edad', 'error');
      return;
    }

    // Validar contraseña mínimo 8 caracteres
    if (this.password.length < 8) {
      Swal.fire('Contraseña débil', 'La contraseña debe tener mínimo 8 caracteres', 'error');
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.password !== this.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    this.loading = true;

    try {
      const { data, error } = await this.supabase.signUp(
        this.email,
        this.password,
        this.name,
        this.surname
      );

      if (error) {
        Swal.fire('Error', error.message, 'error');
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Se ha enviado un correo de verificación. Por favor revisa tu bandeja de entrada.',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => this.router.navigate(['/login']), 2000);
      }
    } catch (err: any) {
      Swal.fire('Error', 'Ocurrió un error inesperado', 'error');
    } finally {
      this.loading = false;
    }
  }
}
