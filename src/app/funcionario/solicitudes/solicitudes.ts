import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.scss'
})

export class SolicitudesComponent implements OnInit {

  solicitudes: any[] = [];

  nombreFuncionario = 'Funcionario';

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {

    await this.cargarSolicitudes();

  }

  async cargarSolicitudes() {

    const { data, error } =
      await this.supabase.client
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {

      console.log(error);

      Swal.fire(
        'Error',
        'No se pudieron cargar las solicitudes',
        'error'
      );

      return;
    }

    this.solicitudes = data || [];

    console.log('SOLICITUDES:', this.solicitudes);

  }

  async responderSolicitud(solicitud: any) {

    if (!solicitud.response) {

      Swal.fire(
        'Error',
        'Debes escribir una respuesta',
        'error'
      );

      return;
    }

    const { error } =
      await this.supabase.client
        .from('requests')
        .update({
          response: solicitud.response,
          status: 'Respondida'
        })
        .eq('id', solicitud.id);

    if (error) {

      console.log(error);

      Swal.fire(
        'Error',
        'No se pudo enviar la respuesta',
        'error'
      );

      return;
    }

    Swal.fire(
      'Éxito',
      'Solicitud respondida correctamente',
      'success'
    );

    await this.cargarSolicitudes();

  }

  async logout() {

    await this.supabase.signOut();

    this.router.navigate(['/']);

  }

}
