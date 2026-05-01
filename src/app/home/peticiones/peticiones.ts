import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

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

    Swal.fire('Enviado', 'Tu petición fue enviada correctamente', 'success');
  }
}
