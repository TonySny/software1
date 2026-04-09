/* login component */

import { Component } from '@angular/core';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  email = '';
  password = '';

  login() {
    console.log(this.email, this.password);
  }
}


import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  email = '';
  password = '';

  login() {
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
