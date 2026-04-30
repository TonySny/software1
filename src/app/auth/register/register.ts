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

  name = '';
  surname = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;

  constructor(
    private router: Router,
    private supabase: SupabaseService
  ) {}

  async register() {
    if (!this.name || !this.surname || !this.email || !this.password || !this.confirmPassword) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

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
            title: 'Verificación',
            text: 'Se le enviará un correo de verificación. Por favor, revise su bandeja de entrada.',
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
