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

    return (data as any).profile_roles?.name ?? null;
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
    return await this.client.auth.getSession();
  }

  async getUserEQ(identification: string) {
    const { data, error } = await this.client
    .from('profiles')
    .select('*')
    .eq('id', identification)
    .single();

    if (error) {
      console.error(error)
      return null
    }

    return data
  }

  async insertarPQRS(ticket: any) {
    const {
      type,
      status,
      profile_id,
      phone,
      email,
      request,
      destination,
      ref_number,
      accept_terms,
      archivos,
    } = ticket;

    // 1. Subir archivos al storage
    const archivosSubidos = await Promise.all(
      archivos.map(async (archivo: any) => {
        const { data: storageData, error: storageError } = await this.client.storage
          .from("pqrs files")
          .upload(archivo.ruta, archivo.file, { upsert: false });

        if (storageError) {
          throw new Error(`Error al subir "${archivo.nombre}" al storage: ${storageError.message}`);
        }

        return { filepath: storageData.path, filename: archivo.nombre };
      })
    );

    // 2. Insertar en public.requests
    const { data: requestData, error: requestError } = await this.client
      .from("requests")
      .insert({
        type,
        status,
        profile_id,
        phone,
        email,
        request,
        destination,
        ref_number,
        accept_terms,
      })
      .select("id")
      .single();

    if (requestError) {
      throw new Error(`Error al insertar en requests: ${requestError.message}`);
    }

    const request_id = requestData.id;

    // 3.insertar archivos en public.requests
    if (archivosSubidos.length) {
      const pathsPayload = archivosSubidos.map(({ filepath, filename }) => ({
        filepath,
        filename,
        request_id,
      }));

      const { error: pathsError } = await this.client
        .from("request_paths")
        .insert(pathsPayload);

      if (pathsError) {
        throw new Error(`Error al insertar en request_paths: ${pathsError.message}`);
      }
    }

    return { success: true, request_id, ref_number };
  }

  async consultarStatus(estado: string) {
    return await this.client
    .from('requests')
    .select('status')
    .eq('ref_number', `${estado}`)
  }

  async consultarPQRS(radicado: string) {
    return await this.client
      .from('requests')
      .select('*')
      .eq('ref_number', radicado)
      .single();
  }
}
