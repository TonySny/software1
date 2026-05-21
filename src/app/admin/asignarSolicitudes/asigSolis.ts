import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-solicitudes',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './asigSolis.html',
  styleUrl: './asigSolis.scss',
})
export class AsignarSolicitudesComponent implements OnInit {

  solicitudes: any[] = [];
  funcionarios: any[] = [];
  cargando = true;

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await Promise.all([
      this.cargarSolicitudes(),
      this.cargarFuncionarios()
    ]);
  }

  async cargarSolicitudes() {
    this.cargando = true;
    const { data, error } = await this.supabase.client
      .from('pqrs')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
    } else {
      this.solicitudes = (data ?? []).map((s: any) => ({
        ...s,
        dias_restantes: this.calcularDiasRestantes(s.created_at)
      }));
    }
    this.cargando = false;
  }

  async cargarFuncionarios() {
    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('id, full_name, full_surname')
      .eq('rol', 'funcionario');

    if (!error) {
      this.funcionarios = data ?? [];
    }
  }

  calcularDiasRestantes(fechaCreacion: string): number {
    const DIAS_LIMITE = 15;
    const creado = new Date(fechaCreacion);
    const hoy = new Date();
    const diasTranscurridos = Math.floor(
      (hoy.getTime() - creado.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, DIAS_LIMITE - diasTranscurridos);
  }

  getTiempoClase(dias: number): string {
    if (dias <= 3) return 'urgente';
    if (dias <= 7) return 'proximo';
    return 'normal';
  }

  async asignarSolicitud(solicitud: any) {
    const { error } = await this.supabase.client
      .from('pqrs')
      .update({ funcionario_asignado: solicitud.funcionario_asignado })
      .eq('id', solicitud.id);

    if (error) {
      Swal.fire('Error', 'No se pudo asignar la solicitud', 'error');
    } else {
      const funcionario = this.funcionarios.find(
        f => f.id === solicitud.funcionario_asignado
      );
      Swal.fire({
        icon: 'success',
        title: 'Solicitud asignada',
        text: funcionario
          ? `Asignada a ${funcionario.full_name} ${funcionario.full_surname}`
          : 'Asignación actualizada',
        timer: 1500,
        showConfirmButton: false
      });
    }
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}