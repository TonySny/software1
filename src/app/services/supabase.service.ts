import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabaseUrl = 'https://vgmyadnozbmorwtpzenx.supabase.co';
  private supabaseKey = 'sb_publishable_XFLyFTai9gAgJ5HK30T3mw_vJrMHMis';

  client: SupabaseClient;

  constructor() {
    this.client = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  async signUp(email: string, password: string, name: string, surname: string) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          full_surname: surname
        }
      }
    });
    return { data, error };
  }

  async signOut() {
    return await this.client.auth.signOut();
  }

  getSession() {
    return this.client.auth.getSession();
  }

  // Métodos para PQRS
  async insertarPQRS(pqrsData: any) {
    const { data, error } = await this.client
      .from('pqrs')
      .insert([pqrsData]);
    return { data, error };
  }

  async consultarPQRS(numeroRadicado: string) {
    const { data, error } = await this.client
      .from('pqrs')
      .select('*')
      .eq('numeroRadicado', numeroRadicado)
      .single();
    return { data, error };
  }
}
