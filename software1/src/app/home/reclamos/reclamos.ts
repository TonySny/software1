import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './reclamos.html',
  styleUrl: './reclamos.scss'
})
export class ReclamosComponent {
  asunto = '';
  descripcion = '';
  destino = '';
  archivo: File | null = null;

  onFileSelected(event: any) {
    this.archivo = event.target.files[0];
  }

  enviarReclamo() {
    if (!this.descripcion || !this.destino) {
      Swal.fire('Error', 'Completa los campos obligatorios', 'error');
      return;
    }

    Swal.fire('Enviado', 'Tu reclamo fue enviado correctamente', 'success');
  }
}
