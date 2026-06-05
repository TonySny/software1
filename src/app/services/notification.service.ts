import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export type TipoNotificacion =
  | 'solicitud_registrada'
  | 'cambio_estado'
  | 'solicitud_respondida'
  | 'cambio_clasificacion';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private supabase: SupabaseService) {}

  async enviar(tipo: TipoNotificacion, correo: string, data: Record<string, string>): Promise<void> {
    const { error } = await this.supabase.client.functions.invoke('send-notification', {
      body: { tipo, correo, data },
    });
    if (error) console.error('Error al enviar notificación:', error);
  }
}