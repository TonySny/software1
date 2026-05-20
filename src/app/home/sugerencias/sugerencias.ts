import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sugerencias.html',
  styleUrl: './sugerencias.scss'
})
export class SugerenciasComponent {
  tipoIdentificacion = '';
  numeroIdentificacion = '';
  nombres = '';
  apellidos = '';
  telefono = '';
  email = '';
  asunto = '';
  descripcion = '';
  medioRespuesta = '';
  archivo: File[] = [];
  aceptaTerminos = false;
  errorArchivos: string[] = [];

  constructor(private supabaseService: SupabaseService) {}

  onFileSelected(event: any) {
    const target = event.target as HTMLInputElement;
    const archivosNuevos = target.files ? Array.from(target.files) : [];
    const tiposPermitidos = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    const archivosValidos: File[] = [];
    const archivosInvalidos: string[] = [];

    archivosNuevos.forEach((file: any) => {
      if (tiposPermitidos.includes(file.type)) {
        archivosValidos.push(file);
      } else {
        archivosInvalidos.push(file.name);
      }
    });

    if (archivosInvalidos.length > 0) {
      this.errorArchivos = archivosInvalidos;
      Swal.fire('Archivo no permitido', `Los siguientes archivos no son permitidos: ${archivosInvalidos.join(', ')}. Solo se permiten PDF e imágenes (PNG, JPG, JPEG, WEBP).`, 'error');
    } else {
      this.errorArchivos = [];
    }

    this.archivo = [...this.archivo, ...archivosValidos];
    target.value = '';
  }

  removeFile(index: number) {
    this.archivo = this.archivo.filter((_, i) => i !== index);
  }

  async enviarSugerencia() {
    if (!this.tipoIdentificacion || !this.numeroIdentificacion || !this.nombres || !this.apellidos || !this.telefono || !this.email || !this.asunto || !this.descripcion || !this.medioRespuesta || !this.aceptaTerminos) {
      Swal.fire('Error', 'Completa todos los campos obligatorios marcados con *', 'error');
      return;
    }

    const numeroRadicado = this.generarNumeroRadicado();

    const pqrsData = {
      tipo: 'sugerencia',
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
      archivo: this.archivo.length ? this.archivo.map(file => file.name) : null
    };

    try {
      const { data, error } = await this.supabaseService.insertarPQRS(pqrsData);

      if (error) {
        Swal.fire('Error', 'No se pudo enviar la sugerencia: ' + error.message, 'error');
      } else {
        Swal.fire('Enviado', `Tu sugerencia fue enviada correctamente. Número de radicado: ${numeroRadicado}`, 'success');
        this.limpiarFormulario();
      }
    } catch (err) {
      Swal.fire('Error', 'Error inesperado al enviar la sugerencia', 'error');
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
    this.archivo = [];
    this.aceptaTerminos = false;
  }
}
