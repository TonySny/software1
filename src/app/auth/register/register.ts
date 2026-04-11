import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule], // 🔥 AQUÍ VA
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  register() {

    if (!this.nombre || !this.email || !this.password || !this.confirmPassword) {
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

    setTimeout(() => {
      this.router.navigate(['/']); //  vuelve al login
    }, 1500);
  }
}
