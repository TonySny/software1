import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import Swal from 'sweetalert2';

// Interfaz limpia para estructurar el reporte de tiempos
interface ReporteTiempo {
  tipo: string;
  tiempoPromedioDias: number;
  tiempoLimiteLegal: number;
}

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

  // Propiedad reactiva para renderizar el reporte de tiempos en el HTML
  reporteTiempos: ReporteTiempo[] = [];

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

      // Función interna para limpiar textos (quita tildes, mayúsculas y espacios)
      const normalizar = (texto: string) =>
        texto ? texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : '';

      // 1. Cálculo de Contadores Globales (Métricas de Tarjetas)
      this.totales.peticion   = registros.filter(r => normalizar(r.clasificacion_usuario) === 'peticion').length;
      this.totales.queja      = registros.filter(r => normalizar(r.clasificacion_usuario) === 'queja').length;
      this.totales.reclamo    = registros.filter(r => normalizar(r.clasificacion_usuario) === 'reclamo').length;
      this.totales.sugerencia = registros.filter(r => normalizar(r.clasificacion_usuario) === 'sugerencia').length;
      this.totales.total      = registros.length;

      // 2. Conteo Dinámico por Estados
      const contarEstado = (s: string) =>
        registros.filter(r => normalizar(r.status) === normalizar(s)).length;

      this.estados = [
        { label: 'Radicada',         count: contarEstado('Radicada'),         color: '#870fa2' },
        { label: 'Asignada en area', count: contarEstado('Asignada en area'), color: '#f59e0b' },
        { label: 'Solucionada',      count: contarEstado('Solucionada'),      color: '#22c55e' },
      ];

      // Definición de tipos de PQRS con sus límites de respuesta legales (Colombia - Ley 1755 de 2015)
      const tipos = [
        { key: 'peticion',   label: 'Petición',   limite: 15 },
        { key: 'queja',      label: 'Queja',      limite: 15 },
        { key: 'reclamo',    label: 'Reclamo',    limite: 15 },
        { key: 'sugerencia', label: 'Sugerencia', limite: 10 },
      ];

      // 3. Renderizado de Tabla de Detalles de Estados
      this.tablaDetalle = tipos.map(t => {
        const del_tipo = registros.filter(r => normalizar(r.clasificacion_usuario) === t.key);
        return {
          tipo:         t.label,
          total:        del_tipo.length,
          radicadas:    del_tipo.filter(r => normalizar(r.status) === 'radicada').length,
          asignadas:    del_tipo.filter(r => normalizar(r.status) === 'asignada en area').length,
          solucionadas: del_tipo.filter(r => normalizar(r.status) === 'solucionada').length,
        };
      });

      // 4. LÓGICA DEL REPORTE DE TIEMPOS (Cálculo de días de ciclo de vida)
      this.reporteTiempos = tipos.map(t => {
        const del_tipo = registros.filter(r => normalizar(r.clasificacion_usuario) === t.key);

        let sumaDias = 0;
        let registrosConFecha = 0;

        del_tipo.forEach(r => {
          if (r.created_at) {
            const fechaInicio = new Date(r.created_at);

            // Si está resuelta, calcula contra la fecha de actualización/cierre.
            // Si sigue abierta, mide el retraso acumulado contra la fecha del día de hoy.
            const fechaFin = (normalizar(r.status) === 'solucionada' && r.updated_at)
              ? new Date(r.updated_at)
              : new Date();

            const diferenciaMs = fechaFin.getTime() - fechaInicio.getTime();
            const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);

            // Evitamos números negativos por desajustes de reloj de BD
            sumaDias += Math.max(0, diferenciaDias);
            registrosConFecha++;
          }
        });

        // Calculamos el promedio matemático redondeado a un decimal
        const promedio = registrosConFecha > 0 ? parseFloat((sumaDias / registrosConFecha).toFixed(1)) : 0;

        return {
          tipo: t.label,
          tiempoPromedioDias: promedio,
          tiempoLimiteLegal: t.limite
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
