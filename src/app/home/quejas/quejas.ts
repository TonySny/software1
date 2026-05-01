import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quejas',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './quejas.html',
  styleUrl: './quejas.scss'
})
export class QuejasComponent {
  asunto = '';
  descripcion = '';
  destino = '';
  archivo: File | null = null;

  onFileSelected(event: any) {
    this.archivo = event.target.files[0];
  }

  enviarQueja() {
    if (!this.descripcion || !this.destino) {
      Swal.fire('Error', 'Completa los campos obligatorios', 'error');
      return;
    }

    Swal.fire('Enviado', 'Tu queja fue enviada correctamente', 'success');
  }
}
