import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.scss'
})
export class EstadisticasComponent implements OnInit {

  cargando = true;

  totales = {
    peticion: 0,
    queja: 0,
    reclamo: 0,
    sugerencia: 0,
    total: 0
  };

  estados: { label: string; count: number; color: string }[] = [];

  tablaDetalle: {
    tipo: string;
    total: number;
    radicadas: number;
    asignadas: number;
    solucionadas: number;
  }[] = [];

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      const { data, error } = await this.supabase.client
        .from('requests')
        .select('*');

      if (error) {
        Swal.fire('Error', 'No se pudieron cargar las estadísticas', 'error');
        return;
      }

      const registros = data ?? [];

      this.totales.peticion   = registros.filter(r => r.clasificacion_usuario?.toLowerCase() === 'petición').length;
      this.totales.queja      = registros.filter(r => r.clasificacion_usuario?.toLowerCase() === 'queja').length;
      this.totales.reclamo    = registros.filter(r => r.clasificacion_usuario?.toLowerCase() === 'reclamo').length;
      this.totales.sugerencia = registros.filter(r => r.clasificacion_usuario?.toLowerCase() === 'sugerencia').length;
      this.totales.total      = registros.length;

      const contarEstado = (s: string) =>
        registros.filter(r => r.status?.toLowerCase() === s.toLowerCase()).length;

      this.estados = [
        { label: 'Radicada',         count: contarEstado('Radicada'),         color: '#870fa2' },
        { label: 'Asignada en area', count: contarEstado('Asignada en area'), color: '#f59e0b' },
        { label: 'Solucionada',      count: contarEstado('Solucionada'),      color: '#22c55e' },
      ];

      const tipos = [
        { key: 'petición',   label: 'Petición' },
        { key: 'queja',      label: 'Queja' },
        { key: 'reclamo',    label: 'Reclamo' },
        { key: 'sugerencia', label: 'Sugerencia' },
      ];

      this.tablaDetalle = tipos.map(t => {
        const del_tipo = registros.filter(r =>
          r.clasificacion_usuario?.toLowerCase() === t.key
        );
        return {
          tipo:         t.label,
          total:        del_tipo.length,
          radicadas:    del_tipo.filter(r => r.status?.toLowerCase() === 'radicada').length,
          asignadas:    del_tipo.filter(r => r.status?.toLowerCase() === 'asignada en area').length,
          solucionadas: del_tipo.filter(r => r.status?.toLowerCase() === 'solucionada').length,
        };
      });

    } catch (err) {
      Swal.fire('Error', 'Error inesperado al cargar estadísticas', 'error');
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  volver() {
    this.router.navigate(['/admin']);
  }
}