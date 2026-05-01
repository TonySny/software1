import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-peticiones',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './peticiones.html',
  styleUrl: './peticiones.scss'
})
export class PeticionesComponent {
  asunto = '';
  descripcion = '';
  destino = '';
  archivo: File | null = null;

  onFileSelected(event: any) {
    this.archivo = event.target.files[0];
  }

  enviarPeticion() {
    if (!this.descripcion || !this.destino) {
      Swal.fire('Error', 'Completa los campos obligatorios', 'error');
      return;
    }

    Swal.fire('Enviado', 'Petición enviada correctamente', 'success');

    this.asunto = '';
    this.descripcion = '';
    this.destino = '';
    this.archivo = null;
  }
}
