import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-solicitudes',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './verSolis.html',
  styleUrl: './verSolis.scss',
})
export class VerSolicitudesComponent implements OnInit {

  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  cargando = true;

  tipos = [
    { nombre: 'Petición',   valor: 'peticion',   activo: true },
    { nombre: 'Queja',      valor: 'queja',      activo: true },
    { nombre: 'Reclamo',    valor: 'reclamo',    activo: true },
    { nombre: 'Sugerencia', valor: 'sugerencia', activo: true },
  ];

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargarSolicitudes();
  }

  async cargarSolicitudes() {
    this.cargando = true;

    const { data: sessionData } = await this.supabase.getSession();
    if (!sessionData.session) {
      this.router.navigate(['/']);
      return;
    }

    const userId = sessionData.session.user.id;

    const { data, error } = await this.supabase.client
      .from('pqrs')
      .select('*')
      .eq('funcionario_asignado', userId)
      .order('created_at', { ascending: true });

    if (error) {
      Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
    } else {
      this.solicitudes = (data ?? []).map((s: any) => ({
        ...s,
        dias_restantes: this.calcularDiasRestantes(s.created_at)
      }));
      this.aplicarFiltro();
    }

    this.cargando = false;
  }

  aplicarFiltro() {
    const tiposActivos = this.tipos
      .filter(t => t.activo)
      .map(t => t.valor);

    this.solicitudesFiltradas = this.solicitudes.filter(s =>
      tiposActivos.includes(s.tipo?.toLowerCase())
    );
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

  volver() {
    this.router.navigate(['/funcionario']);
  }
}