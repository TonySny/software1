import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-consultar',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './consultar.html',
  styleUrl: './consultar.scss'
})
export class ConsultarComponent {
  numeroRadicado = '';
  pqrsData: any = null;

  constructor(private supabaseService: SupabaseService) {}

  async consultarPQRS() {
    if (!this.numeroRadicado) {
      Swal.fire('Error', 'Ingresa el número de radicado', 'error');
      return;
    }

    try {
      const { data, error } = await this.supabaseService.consultarPQRS(this.numeroRadicado);

      if (error) {
        Swal.fire('Error', 'No se encontró el PQRS con ese número de radicado', 'error');
        this.pqrsData = null;
      } else {
        this.pqrsData = data;
      }
    } catch (err) {
      Swal.fire('Error', 'Error inesperado al consultar el PQRS', 'error');
    }
  }
}