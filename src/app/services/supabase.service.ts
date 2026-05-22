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
    const { data, error } = await this.client.auth.signUp({
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
          city_id: ciudadId,
          role: 'usuario'
        }
      }
    });

    if (error || !data.user) return { data, error };

    // Insertar en profiles con rol Usuario automáticamente
    const { error: profileError } = await this.client
      .from('profiles')
      .insert([{
        id: data.user.id,
        role_id: '8b7101d1-6bbf-4d8b-9d6d-186477fdaa36',
        name: nombre,
        surname: apellido,
        dni: numeroDocumento,
        dni_type_id: tipoDocumentoId,
        sex: sexo,
        age: edad,
        ethnic_group_id: grupoEtnicoId,
        city_id: ciudadId
      }]);

    if (profileError) {
      console.error('Error al crear perfil:', profileError);
    }

    return { data, error };
  }

  async getUserRole() {
    const { data: { user } } = await this.client.auth.getUser();

    if (!user) return null;

    const { data, error } = await this.client
      .from('profiles')
      .select(`
        role_id,
        profile_roles (
          name
        )
      `)
      .eq('id', user.id)
      .single();

    console.log('PROFILE:', data);

    if (error || !data) {
      console.log(error);
      return null;
    }

    return (data as any).profile_roles.name;
  }

  async selectEthnicGroup() {
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