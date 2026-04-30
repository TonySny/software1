import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule], // 🔥 AQUÍ VA
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  nombre = '';
  apellido = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;

  constructor(
    private router: Router,
    private supabase: SupabaseService
  ) {}

  async register() {
    if (!this.nombre || !this.apellido || !this.email || !this.password || !this.confirmPassword) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Cuenta creada',
      text: 'Registro exitoso ',
      timer: 1500,
      showConfirmButton: false
    });

    this.loading = true;

    try {
      const { data, error } = await this.supabase.signUp(
        this.email, 
        this.password, 
        this.nombre, 
        this.apellido
      );

      if (error) {
        Swal.fire('Error', error.message, 'error');
      } else {
        Swal.fire({
            icon: 'success',
            title: 'Cuenta creada',
            text: 'Registro exitoso',
            timer: 1500,
            showConfirmButton: false
        });

        setTimeout(() => {
          this.router.navigate(['/']); //  vuelve al login
        }, 1500);
      }
    } catch (err: any) {
      Swal.fire('Error', 'Ocurrió un error inesperado', 'error');
    } finally {
      this.loading = false;
    }
  }
}
