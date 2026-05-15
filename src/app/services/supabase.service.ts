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

  async signUp(
    email: string, 
    password: string, 
    nombre: string, 
    apellido: string,
    numeroDocumento: string,
    tipoDocumentoId: string,
    sexo: string,
    edad: number,
    grupoEtnicoId: string,
    ciudadId: string
  ) {
    const { data: data, error: error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nombre,
          full_surname: apellido,
          dni: numeroDocumento,
          dni_type_id: tipoDocumentoId,
          sex: sexo,
          age: edad,
          ethnic_group_id: grupoEtnicoId,
          city_id: ciudadId
        }
      }
    });

    return { data, error };
  }

  async selectEthnicGroup(){
    const { data, error } = await this.client
      .from('ethnic_groups')
      .select('id, name')
      .order('name', { ascending: true });
      
    return { data, error };
  }

  async selectDocumentTypes() {
    const { data, error } = await this.client
      .from('document_types')
      .select('id, name')
      .order('name', { ascending: true });
      
    return { data, error };
  }

  async selectSexEnums() {

  }

  async selectDepartments() {
    const { data, error } = await this.client
      .from('departments')
      .select('id, name')
      .order('name', { ascending: true });
    return { data, error };
  }

  async selectCities(departmentId: string) {
    const { data, error } = await this.client
      .from('cities')
      .select('id, name')
      .eq('department_id', departmentId)
      .order('name', { ascending: true });
    return { data, error };
  }

  async signOut() {
    return await this.client.auth.signOut();
  }

  async getSession() {
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
