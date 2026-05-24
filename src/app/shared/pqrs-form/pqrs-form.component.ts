import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';
import { PqrConfig } from '../pqrs-config';

@Component({
  selector: 'app-pqr-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pqrs-form.component.html',
  styleUrl: './pqrs-form.component.scss',
})
export class PqrFormComponent {

  /** Configuración inyectada por el componente padre (petición, queja, etc.) */
  @Input({ required: true }) config!: PqrConfig;

  // ── Estado del formulario ──────────────────────────────────────────────────
  telefono = '';
  email = '';
  descripcion = '';
  destino = '';
  archivos: File[] = [];
  aceptaTerminos = false;
  errorArchivos: string[] = [];

  constructor(private supabaseService: SupabaseService) {}

  // ── Manejo de archivos ─────────────────────────────────────────────────────

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const archivosNuevos = target.files ? Array.from(target.files) : [];

    const tiposPermitidos = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/webp',
    ];

    // Límite: máximo 4 archivos en total
    if (this.archivos.length + archivosNuevos.length > 4) {
      Swal.fire('Límite excedido', 'Solo puedes subir máximo 4 archivos', 'error');
      target.value = '';
      return;
    }

    // Límite: máximo 100 MB en total
    const pesoActual = this.archivos.reduce((t, f) => t + f.size, 0);
    const pesoNuevo  = archivosNuevos.reduce((t, f) => t + f.size, 0);

    if (pesoActual + pesoNuevo > 100 * 1024 * 1024) {
      Swal.fire('Peso excedido', 'El tamaño total no puede superar 100 MB', 'error');
      target.value = '';
      return;
    }

    // Validar tipos
    const validos:   File[]   = [];
    const invalidos: string[] = [];

    archivosNuevos.forEach((file) => {
      tiposPermitidos.includes(file.type)
        ? validos.push(file)
        : invalidos.push(file.name);
    });

    if (invalidos.length > 0) {
      this.errorArchivos = invalidos;
      Swal.fire(
        'Archivo no permitido',
        `Archivos no permitidos: ${invalidos.join(', ')}. Solo PDF e imágenes (PNG, JPG, JPEG, WEBP).`,
        'error'
      );
    } else {
      this.errorArchivos = [];
    }

    this.archivos = [...this.archivos, ...validos];
    target.value = '';
  }

  removeFile(index: number) {
    this.archivos = this.archivos.filter((_, i) => i !== index);
  }

  // ── Envío ──────────────────────────────────────────────────────────────────

  async onEnviar() {
    if (!this.descripcion || !this.destino || !this.aceptaTerminos) {
      Swal.fire(
        'Campos incompletos',
        'Completa todos los campos obligatorios marcados con *',
        'error'
      );
      return;
    }

    const session   = await this.supabaseService.getSession();
    const id_perfil = session.data.session?.user?.id;
    const num_radicado = this.generarNumeroRadicado();

    const ticket = {
      type:         this.config.tipo_solicitud,
      status:       'Registrada',
      profile_id:   id_perfil,
      phone:        this.telefono,
      email:        this.email,
      request:      this.descripcion,
      destination:  this.destino,
      ref_number:   num_radicado,
      accept_terms: this.aceptaTerminos,
      archivos: this.archivos.map((file) => ({
        ruta:   `pqrs/${num_radicado}/${file.name}`,
        nombre: file.name,
        file,
      })),
    };

    try {
      await this.supabaseService.insertarPQRS(ticket);
      Swal.fire(
        'Enviado',
        `Tu solicitud fue enviada. Número de radicado: ${num_radicado}`,
        'success'
      );
      this.limpiarFormulario();
    } catch (err: any) {
      Swal.fire('Error', err?.message ?? 'Error inesperado al enviar', 'error');
    }
  }

  // ── Helpers privados ───────────────────────────────────────────────────────

  private generarNumeroRadicado(): string {
    const fecha = new Date();
    const timestamp = `${fecha.getFullYear()}${fecha.getMonth() + 1}${fecha.getDate()}`;
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${this.config.radicadoPrefix}-${timestamp}-${random}`;
  }

  private limpiarFormulario() {
    this.telefono     = '';
    this.email        = '';
    this.descripcion  = '';
    this.destino      = '';
    this.archivos     = [];
    this.aceptaTerminos = false;
  }
}
