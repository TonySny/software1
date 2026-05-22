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
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PQR-${timestamp}-${random}`;
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
