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
  tipo_solicitud = 'Sugerencia';
  estado = 'Registrada';
  id_perfil = '';
  telefono = '';
  status = '';
  email = '';
  descripcion = '';
  destino = '';
  archivo: File[] = [];
  aceptaTerminos = false;
  errorArchivos: string[] = [];

  constructor(private supabaseService: SupabaseService) {}

  onFileSelected(event: any) {

  const target = event.target as HTMLInputElement;

  const archivosNuevos =
    target.files ? Array.from(target.files) : [];

  const tiposPermitidos = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp'
  ];

  const archivosValidos: File[] = [];

  const archivosInvalidos: string[] = [];

  /* =========================
     LIMITE DE 4 ARCHIVOS
     ========================= */

  if ((this.archivo.length + archivosNuevos.length) > 4) {

    Swal.fire(
      'Límite excedido',
      'Solo puedes subir máximo 4 archivos',
      'error'
    );

    target.value = '';

    return;
  }

  /* =========================
     LIMITE TOTAL 100 MB
     ========================= */

  const pesoActual =
    this.archivo.reduce(
      (total, file) => total + file.size,
      0
    );

  const pesoNuevo =
    archivosNuevos.reduce(
      (total: number, file: any) => total + file.size,
      0
    );

  const pesoTotal =
    pesoActual + pesoNuevo;

  const limiteMB =
    100 * 1024 * 1024;

  if (pesoTotal > limiteMB) {

    Swal.fire(
      'Peso excedido',
      'El tamaño total de los archivos no puede superar 100 MB',
      'error'
    );

    target.value = '';

    return;
  }

  /* =========================
     VALIDAR TIPOS
     ========================= */

  archivosNuevos.forEach((file: any) => {

    if (tiposPermitidos.includes(file.type)) {

      archivosValidos.push(file);

    } else {

      archivosInvalidos.push(file.name);

    }

  });

  /* =========================
     ARCHIVOS INVALIDOS
     ========================= */

  if (archivosInvalidos.length > 0) {

    this.errorArchivos = archivosInvalidos;

    Swal.fire(
      'Archivo no permitido',
      `Los siguientes archivos no son permitidos: ${archivosInvalidos.join(', ')}.
      Solo se permiten PDF e imágenes (PNG, JPG, JPEG, WEBP).`,
      'error'
    );

  } else {

    this.errorArchivos = [];

  }

  /* =========================
     GUARDAR ARCHIVOS
     ========================= */

  this.archivo = [
    ...this.archivo,
    ...archivosValidos
  ];

  target.value = '';

}
  removeFile(index: number) {
    this.archivo = this.archivo.filter((_, i) => i !== index);
  }

  async enviarSugerencia() {
    if (!this.descripcion || !this.destino || !this.aceptaTerminos) {
      Swal.fire('Campos incompletos', 'Completa todos los campos obligatorios marcados con *', 'error');
      return;
    }


    const id_perfil = (await this.supabaseService.getSession()).data.session?.user?.id;
    const num_radicado = this.generarNumeroRadicado();

    const ticket = {
      type: this.tipo_solicitud,
      status: this.estado,
      profile_id: id_perfil,
      phone: this.telefono,
      email: this.email,
      request: this.descripcion,
      destination: this.destino,
      ref_number: num_radicado,
      accept_terms: this.aceptaTerminos,
      archivos: this.archivo.map((file: File) => ({
        ruta: `pqrs/${num_radicado}/${file.name}`,
        nombre: file.name,
        file,
      })),
    };

    try {
      await this.supabaseService.insertarPQRS(ticket);
      Swal.fire('Enviado', `Tu solicitud fue enviada correctamente. Número de radicado: ${num_radicado}`, 'success');
      this.limpiarFormulario();
    } catch (err: any) {
      Swal.fire('Error', err?.message ?? 'Error inesperado al enviar la solicitud', 'error');
    }
  }

  private generarNumeroRadicado(): string {
    const fecha = new Date();
    const timestamp = `${fecha.getFullYear()}${fecha.getMonth}${fecha.getDay}`;
    const random = Math.floor(Math.random() * 1000);
    return `PQRS-S-${timestamp}-${random}`;
  }


  private limpiarFormulario() {
    this.telefono = '';
    this.email = '';
    this.descripcion = '';
    this.destino = '';
    this.archivo = [];
    this.aceptaTerminos = false;
  }
}
