import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes.html',
  styleUrls: ['./solicitudes.scss']
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

  console.log('SOLICITUDES:', data);

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
}

async responderSolicitud(solicitud: any) {

  if (!solicitud.respuesta) {

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
        response: solicitud.respuesta
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
}
  async cargarsolicitudes() {

  const { data, error } =
    await this.supabase.client
      .from('requests')
      .select('*');

  console.log(data);

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

}


async logout() {

  await this.supabase.signOut();

  this.router.navigate(['/']);

}

}
