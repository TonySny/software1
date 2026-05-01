import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './sugerencias.html',
  styleUrl: './sugerencias.scss'
})
export class SugerenciasComponent {
  asunto = '';
  descripcion = '';
  destino = '';
  archivo: File | null = null;

  onFileSelected(event: any) {
    this.archivo = event.target.files[0];
  }

  enviarSugerencia() {
    if (!this.descripcion || !this.destino) {
      Swal.fire('Error', 'Completa los campos obligatorios', 'error');
      return;
    }

    Swal.fire('Enviado', 'Tu sugerencia fue enviada correctamente', 'success');
  }
}
