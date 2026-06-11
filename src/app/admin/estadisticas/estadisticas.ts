import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import Swal from 'sweetalert2';

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
radicados: Radicado[] = [];
  cargando = true;

  totales = { peticion: 0, queja: 0, reclamo: 0, sugerencia: 0, total: 0 };

  estados: { label: string; count: number; color: string }[] = [];

  tablaDetalle: {
    tipo: string; total: number;
    radicadas: number; asignadas: number; solucionadas: number;

  }[] = [];

  reporteTiempos: ReporteTiempo[] = [];




  // ✅ Declarada aquí, al nivel de la clase
  kpiTiempos: {
    tipo: string;
    icono: string;
    tiempoPromedioDias: number;
    tiempoLimiteLegal: number;


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

      const normalizar = (texto: string) =>
        texto ? texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : '';

      // 1. Totales
      this.totales.peticion   = registros.filter(r => normalizar(r.clasificacion_usuario) === 'peticion').length;
      this.totales.queja      = registros.filter(r => normalizar(r.clasificacion_usuario) === 'queja').length;
      this.totales.reclamo    = registros.filter(r => normalizar(r.clasificacion_usuario) === 'reclamo').length;
      this.totales.sugerencia = registros.filter(r => normalizar(r.clasificacion_usuario) === 'sugerencia').length;
      this.totales.total      = registros.length;

      // 2. Estados
      const contarEstado = (s: string) =>
        registros.filter(r => normalizar(r.status) === normalizar(s)).length;

      this.estados = [
        { label: 'Radicada',         count: contarEstado('Radicada'),         color: '#870fa2' },
        { label: 'Asignada en area', count: contarEstado('Asignada en area'), color: '#f59e0b' },
        { label: 'Solucionada',      count: contarEstado('Solucionada'),      color: '#22c55e' },
      ];

      const tipos = [
        { key: 'peticion',   label: 'Petición',   limite: 15 },
        { key: 'queja',      label: 'Queja',      limite: 15 },
        { key: 'reclamo',    label: 'Reclamo',    limite: 15 },
        { key: 'sugerencia', label: 'Sugerencia', limite: 10 },
      ];

      // 3. Tabla detalle
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



      // 4. Reporte de tiempos
      this.reporteTiempos = tipos.map(t => {
        const del_tipo = registros.filter(r => normalizar(r.clasificacion_usuario) === t.key);
        let sumaDias = 0;
        let registrosConFecha = 0;


        del_tipo.forEach(r => {
          if (r.created_at) {
            const fechaInicio = new Date(r.created_at);
            const fechaFin = (normalizar(r.status) === 'solucionada' && r.updated_at)
              ? new Date(r.updated_at)
              : new Date();
            const diferenciaDias = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24);
            sumaDias += Math.max(0, diferenciaDias);
            registrosConFecha++;
          }
        }); // ✅ forEach cierra aquí

        const promedio = registrosConFecha > 0
          ? parseFloat((sumaDias / registrosConFecha).toFixed(1))
          : 0;

        return {
          tipo: t.label,
          tiempoPromedioDias: promedio,
          tiempoLimiteLegal: t.limite
        };
      });

      // ✅ 5. KPI cards — DESPUÉS de que reporteTiempos ya está construido
      const iconos: Record<string, string> = {
        'peticion':   '📩',
        'queja':      '⚠️',
        'reclamo':    '🛠️',
        'sugerencia': '💡',
      };
      this.kpiTiempos = this.reporteTiempos.map(rt => ({
        tipo:               rt.tipo,
        icono:              iconos[normalizar(rt.tipo)] ?? '📋',
        tiempoPromedioDias: rt.tiempoPromedioDias,
        tiempoLimiteLegal:  rt.tiempoLimiteLegal,
      }));
      // 6. Lista de radicados individuales
this.radicados = registros.map(r => {
  const fechaInicio = r.created_at ? new Date(r.created_at) : new Date();
  const fechaFin = (normalizar(r.status) === 'solucionada' && r.updated_at)
    ? new Date(r.updated_at)
    : new Date();
  const dias = Math.max(0, Math.floor(
    (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
  ));
  return {
    numero: r.ref_number ?? 'SIN RADICADO',
    tipo:              r.clasificacion_usuario ?? 'N/A',
    estado:            r.status ?? 'N/A',
    fecha:             r.created_at
                         ? new Date(r.created_at).toLocaleDateString('es-CO')
                         : 'N/A',
    diasTranscurridos: dias,
  };
}).sort((a, b) => b.diasTranscurridos - a.diasTranscurridos);





    } catch (err) {
      Swal.fire('Error', 'Error inesperado al cargar estadísticas', 'error');
    }
     finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }

  }



  volver() {
    this.router.navigate(['/admin']);
  }
}

interface Radicado {
  numero: string;
  tipo: string;
  estado: string;
  fecha: string;
  diasTranscurridos: number;
}
