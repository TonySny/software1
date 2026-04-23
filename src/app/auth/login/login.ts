import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; //
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule], //
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  constructor(private router: Router) {}

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

  Swal.fire('Bienvenido', 'Login exitoso ', 'success');

setTimeout(() => {
  this.router.navigate(['/home']); //
}, 1500);
  }



  forgotPassword() {
  Swal.fire({
    title: 'Recuperar contraseña',
    input: 'email',
    inputLabel: 'Ingresa tu correo',
    inputPlaceholder: 'correo@gmail.com',
    confirmButtonText: 'Enviar',
    showCancelButton: true,
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Enviado',
        'Se ha enviado un enlace de recuperación a tu correo',
        'success'
      );
    }
  });
}


}
