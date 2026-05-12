import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {

  // Control de modales
  mostrarLogin = false;
  mostrarRegister = false;

  // Login
  email = '';
  password = '';
  loadingLogin = false;

  // Register
  name = '';
  surname = '';
  tipoDocumento = '';
  numeroDocumento = '';
  sexo = '';
  edad: number | null = null;
  grupoEtnico = '';
  ciudad = '';
  emailReg = '';
  passwordReg = '';
  confirmPassword = '';
  loadingRegister = false;

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  abrirLogin() {
    this.mostrarLogin = true;
    this.mostrarRegister = false;
  }

  abrirRegister() {
    this.mostrarRegister = true;
    this.mostrarLogin = false;
  }

  cerrarModales() {
    this.mostrarLogin = false;
    this.mostrarRegister = false;
  }

  async login() {
    if (!this.email || !this.password) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }
    this.loadingLogin = true;
    try {
      const { data, error } = await this.supabase.signIn(this.email, this.password);
      if (error) {
        Swal.fire('Error', 'Correo o contraseña incorrectos', 'error');
      } else {
        Swal.fire('Bienvenid@', 'Has iniciado sesión correctamente.', 'success');
        this.cerrarModales();
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      }
    } catch {
      Swal.fire('Error', 'Ocurrió un error inesperado', 'error');
    } finally {
      this.loadingLogin = false;
    }
  }

  async register() {
    if (!this.name || !this.surname || !this.tipoDocumento || !this.numeroDocumento ||
        !this.sexo || !this.edad || !this.grupoEtnico || !this.ciudad ||
        !this.emailReg || !this.passwordReg || !this.confirmPassword) {
      Swal.fire('Campos incompletos', 'Todos los campos son obligatorios', 'error');
      return;
    }
    if (this.edad < 18) {
      Swal.fire('No permitido', 'El sistema no permite el registro de menores de edad', 'error');
      return;
    }
    if (this.passwordReg.length < 8) {
      Swal.fire('Contraseña débil', 'La contraseña debe tener mínimo 8 caracteres', 'error');
      return;
    }
    if (this.passwordReg !== this.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }
    this.loadingRegister = true;
    try {
      const { data, error } = await this.supabase.signUp(this.emailReg, this.passwordReg, this.name, this.surname);
      if (error) {
        Swal.fire('Error', error.message, 'error');
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Se ha enviado un correo de verificación.',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => this.abrirLogin(), 2000);
      }
    } catch {
      Swal.fire('Error', 'Ocurrió un error inesperado', 'error');
    } finally {
      this.loadingRegister = false;
    }
  }
}