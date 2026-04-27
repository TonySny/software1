import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabaseUrl = 'https://vgmyadnozbmorwtpzenx.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbXlhZG5vemJtb3J3dHB6ZW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDc0MTcsImV4cCI6MjA5MjI4MzQxN30.8ndhs45C-l6VJdeHfLaD4AFSPzfcWUZXhaCpQavaWRg';

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

  async signOut() {
    return await this.client.auth.signOut();
  }

  getSession() {
    return this.client.auth.getSession();
  }
}
