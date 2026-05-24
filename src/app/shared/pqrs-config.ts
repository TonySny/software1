// ─────────────────────────────────────────────
//  PQR CONFIG — fuente única de verdad
//  Aquí cambias textos, íconos, leyes, etc.
//  para las 4 páginas desde un solo lugar.
// ─────────────────────────────────────────────

export interface InfoBadge {
  icon: string;
  title: string;
  description: string;
}

export interface PqrConfig {
  /** Prefijo del radicado: PQRS-P-, PQRS-Q-, etc. */
  radicadoPrefix: string;
  /** Valor guardado en BD: 'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia' */
  tipo_solicitud: string;
  /** Ícono del encabezado del formulario */
  formIcon: string;
  /** Título del formulario: "Nueva Petición", "Nueva Queja"… */
  formTitle: string;
  /** Texto del botón enviar */
  submitLabel: string;
  /** Título del panel informativo lateral */
  infoPanelTitle: string;
  /** Párrafo explicativo del panel informativo */
  infoPanelDescription: string;
  /** Badges del panel informativo */
  infoBadges: InfoBadge[];
  /** Texto legal inferior del panel */
  legalText: string;
  /** URL del botón "Ver ley" */
  legalUrl: string;
  /** Etiqueta del botón "Ver ley" */
  legalLabel: string;
}

export const PQR_CONFIGS: Record<string, PqrConfig> = {

  peticion: {
    radicadoPrefix: 'PQRS-P',
    tipo_solicitud: 'Petición',
    formIcon: '📩',
    formTitle: 'Nueva Petición',
    submitLabel: '📩 Enviar Petición',
    infoPanelTitle: '¿Qué es una petición?',
    infoPanelDescription:
      'Una petición es el derecho que tiene todo ciudadano de presentar solicitudes respetuosas a las autoridades por motivos de interés general o particular.',
    infoBadges: [
      {
        icon: '📋',
        title: 'Derecho de petición',
        description: 'Protegido por la Constitución Política de Colombia, Art. 23',
      },
      {
        icon: '⏱️',
        title: 'Tiempo de respuesta',
        description: 'Máximo 15 días hábiles según la Ley 1755 de 2015',
      },
      {
        icon: '🔒',
        title: 'Datos protegidos',
        description: 'Tratamiento conforme a la Ley 1581 de 2012',
      },
    ],
    legalText: 'Ley 1755 de 2015 · Art. 23 C.P.',
    legalUrl: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=65334',
    legalLabel: 'Ver Ley 1755 del 2015',
  },

  queja: {
    radicadoPrefix: 'PQRS-Q',
    tipo_solicitud: 'Queja',
    formIcon: '⚠️',
    formTitle: 'Nueva Queja',
    submitLabel: '⚠️ Enviar Queja',
    infoPanelTitle: '¿Qué es una queja?',
    infoPanelDescription:
      'Una queja es la manifestación de protesta, censura o descontento que formula una persona por la conducta irregular de un servidor público.',
    infoBadges: [
      {
        icon: '📋',
        title: 'Derecho de queja',
        description: 'Protegido por la Constitución Política de Colombia, Art. 23',
      },
      {
        icon: '⏱️',
        title: 'Tiempo de respuesta',
        description: 'Máximo 15 días hábiles según la Ley 1755 de 2015',
      },
      {
        icon: '🔒',
        title: 'Datos protegidos',
        description: 'Tratamiento conforme a la Ley 1581 de 2012',
      },
    ],
    legalText: 'Ley 1755 de 2015 · Art. 23 C.P.',
    legalUrl: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=65334',
    legalLabel: 'Ver Ley 1755 del 2015',
  },

  reclamo: {
    radicadoPrefix: 'PQRS-R',
    tipo_solicitud: 'Reclamo',
    formIcon: '📢',
    formTitle: 'Nuevo Reclamo',
    submitLabel: '📢 Enviar Reclamo',
    infoPanelTitle: '¿Qué es un reclamo?',
    infoPanelDescription:
      'Un reclamo es el derecho que tiene el ciudadano de exigir, reivindicar o demandar una solución ante la suspensión injustificada o la prestación deficiente de un servicio.',
    infoBadges: [
      {
        icon: '📋',
        title: 'Derecho de reclamo',
        description: 'Protegido por la Constitución Política de Colombia, Art. 23',
      },
      {
        icon: '⏱️',
        title: 'Tiempo de respuesta',
        description: 'Máximo 15 días hábiles según la Ley 1755 de 2015',
      },
      {
        icon: '🔒',
        title: 'Datos protegidos',
        description: 'Tratamiento conforme a la Ley 1581 de 2012',
      },
    ],
    legalText: 'Ley 1755 de 2015 · Art. 23 C.P.',
    legalUrl: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=65334',
    legalLabel: 'Ver Ley 1755 del 2015',
  },

  sugerencia: {
    radicadoPrefix: 'PQRS-S',
    tipo_solicitud: 'Sugerencia',
    formIcon: '💡',
    formTitle: 'Nueva Sugerencia',
    submitLabel: '💡 Enviar Sugerencia',
    infoPanelTitle: '¿Qué es una sugerencia?',
    infoPanelDescription:
      'Una sugerencia es la propuesta que presenta un ciudadano para mejorar los procesos, corregir fallas o para reconocer el buen trato recibido.',
    infoBadges: [
      {
        icon: '📋',
        title: 'Derecho de sugerencia',
        description: 'Protegido por la Constitución Política de Colombia, Art. 23',
      },
      {
        icon: '⏱️',
        title: 'Tiempo de respuesta',
        description: 'Máximo 30 días hábiles según la Ley 1755 de 2015',
      },
      {
        icon: '🔒',
        title: 'Datos protegidos',
        description: 'Tratamiento conforme a la Ley 1581 de 2012',
      },
    ],
    legalText: 'Ley 1755 de 2015 · Art. 23 C.P.',
    legalUrl: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=65334',
    legalLabel: 'Ver Ley 1755 del 2015',
  },

};
