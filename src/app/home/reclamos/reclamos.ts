import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './reclamos.html',
  styleUrl: './reclamos.scss'
})
export class ReclamosComponent {
  tipoIdentificacion = '';
  numeroIdentificacion = '';
  nombres = '';
  apellidos = '';
  telefono = '';
  email = '';
  asunto = '';
  descripcion = '';
  medioRespuesta = '';
  archivo: File | null = null;
  aceptaTerminos = false;

  constructor(private supabaseService: SupabaseService) {}

  onFileSelected(event: any) {
    this.archivo = event.target.files[0];
  }

  async enviarReclamo() {
    if (!this.tipoIdentificacion || !this.numeroIdentificacion || !this.nombres || !this.apellidos || !this.telefono || !this.email || !this.asunto || !this.descripcion || !this.medioRespuesta || !this.aceptaTerminos) {
      Swal.fire('Error', 'Completa todos los campos obligatorios marcados con *', 'error');
      return;
    }

    const numeroRadicado = this.generarNumeroRadicado();

    const pqrsData = {
      tipo: 'reclamo',
      tipoIdentificacion: this.tipoIdentificacion,
      numeroIdentificacion: this.numeroIdentificacion,
      nombres: this.nombres,
      apellidos: this.apellidos,
      telefono: this.telefono,
      email: this.email,
      asunto: this.asunto,
      descripcion: this.descripcion,
      medioRespuesta: this.medioRespuesta,
      numeroRadicado: numeroRadicado,
      estado: 'recibido',
      fechaCreacion: new Date().toISOString(),
      archivo: this.archivo ? this.archivo.name : null
    };

    try {
      const { data, error } = await this.supabaseService.insertarPQRS(pqrsData);

      if (error) {
        Swal.fire('Error', 'No se pudo enviar el reclamo: ' + error.message, 'error');
      } else {
        Swal.fire('Enviado', `Tu reclamo fue enviado correctamente. Número de radicado: ${numeroRadicado}`, 'success');
        this.limpiarFormulario();
      }
    } catch (err) {
      Swal.fire('Error', 'Error inesperado al enviar el reclamo', 'error');
    }
  }

  private generarNumeroRadicado(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PQR-${timestamp}-${random}`;
  }

  private limpiarFormulario() {
    this.tipoIdentificacion = '';
    this.numeroIdentificacion = '';
    this.nombres = '';
    this.apellidos = '';
    this.telefono = '';
    this.email = '';
    this.asunto = '';
    this.descripcion = '';
    this.medioRespuesta = '';
    this.archivo = null;
    this.aceptaTerminos = false;
  }
}
