import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent {
  nombreAdmin = 'Administrador';

  constructor(private router: Router) {}

  async logout() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#870fa2',
      cancelButtonColor: '#aaa'
    });

    if (result.isConfirmed) {
      this.router.navigate(['/']);
    }
  }

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }
}