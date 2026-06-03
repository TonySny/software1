import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';
import { PqrConfig } from '../pqrs-config';

const LIMITE_MB = 100;
const LIMITE_BYTES = LIMITE_MB * 1024 * 1024;

@Component({
  selector: 'app-pqr-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pqrs-form.component.html',
  styleUrl: './pqrs-form.component.scss',
})
export class PqrFormComponent {

  @Input({ required: true }) config!: PqrConfig;

  telefono = '';
  email = '';
  descripcion = '';
  destino = '';
  archivos: File[] = [];
  aceptaTerminos = false;
  errorArchivos: string[] = [];

  // ── Getters para la barra de espacio ──────────────────────────────────────

  get pesoUsadoBytes(): number {
    return this.archivos.reduce((t, f) => t + f.size, 0);
  }

  get pesoUsadoMB(): string {
    return (this.pesoUsadoBytes / 1024 / 1024).toFixed(2);
  }

  get pesoRestanteMB(): string {
    return ((LIMITE_BYTES - this.pesoUsadoBytes) / 1024 / 1024).toFixed(2);
  }

  get pesoRestanteMBNum(): number {
    return (LIMITE_BYTES - this.pesoUsadoBytes) / 1024 / 1024;
  }

  get porcentajeUsado(): number {
    return Math.min(100, (this.pesoUsadoBytes / LIMITE_BYTES) * 100);
  }

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

    if (this.archivos.length + archivosNuevos.length > 4) {
      Swal.fire('Límite excedido', 'Solo puedes subir máximo 4 archivos', 'error');
      target.value = '';
      return;
    }

    const pesoNuevo = archivosNuevos.reduce((t, f) => t + f.size, 0);

    if (this.pesoUsadoBytes + pesoNuevo > LIMITE_BYTES) {
      const restante = ((LIMITE_BYTES - this.pesoUsadoBytes) / 1024 / 1024).toFixed(2);
      Swal.fire(
        'Peso excedido',
        `El tamaño total no puede superar ${LIMITE_MB} MB. Te quedan ${restante} MB disponibles.`,
        'error'
      );
      target.value = '';
      return;
    }

    const validos: File[] = [];
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
      Swal.fire('Campos incompletos', 'Completa todos los campos obligatorios marcados con *', 'error');
      return;
    }

    const session = await this.supabaseService.getSession();
    const id_perfil = session.data.session?.user?.id;
    const num_radicado = this.generarNumeroRadicado();

    const ticket = {
      type:         this.config.tipo_solicitud,
      status:       'Radicada',
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
      Swal.fire(`Número: ${num_radicado}`, 'Su solicitud fue enviada exitosamente. Por favor, conserve el número de radicado, le servirá para consultar una posible respuesta a su solicitud.', 'success');
      this.limpiarFormulario();
    } catch (err: any) {
      Swal.fire('Error', err?.message ?? 'Error inesperado al enviar', 'error');
    }
  }

  private generarNumeroRadicado(): string {
    const fecha = new Date()
    const timestamp = `${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${fecha.getDate()}`;
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