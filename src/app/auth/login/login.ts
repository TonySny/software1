import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // 🔥 FALTA ESTO
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule], // 🔥 aquí también
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  email = '';
  password = '';

  login() {
    console.log(this.email, this.password);

    if (!this.email || !this.password) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (this.email !== 'admin@gmail.com' || this.password !== '1234') {
      Swal.fire('Oops...', 'Credenciales incorrectas', 'error');
      return;
    }

    Swal.fire('Bienvenido', 'Login exitoso 🎉', 'success');
  }
}
