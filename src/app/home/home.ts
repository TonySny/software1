import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit{

  // Control de modales
  mostrarLogin = false;
  mostrarRegister = false;

  // Login
  email = '';
  password = '';
  loadingLogin = false;

  // Register
  nombre = '';
  apellido = '';
  tipoDocumento = '';
  numeroDocumento = '';
  sexo = '';
  edad: number | null = null;
  grupoEtnico = '';
  departamento = "";
  ciudad = '';
  emailReg = '';
  confirmEmailReg = '';
  passwordReg = '';
  confirmPassword = '';
  loadingRegister = false;

  // Opciones para selects
  gruposEtnicos: any[] = [];
  tiposDocumento: any[] = [];
  departamentos: any[] = [];
  ciudades: any[] = [];

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}
  
  async ngOnInit() {
    await this.showDepartments();
    await this.showEthnicGroups();
    await this.showDocumentTypes();
  }

  abrirLogin() {
    this.mostrarLogin = true;
    this.mostrarRegister = false;
  }

  abrirRegister() {
    this.mostrarRegister = true;
    this.mostrarLogin = false;
  }

  cerrarModales() {
    this.mostrarLogin = false;
    this.mostrarRegister = false;
  }

  abrirNormativa() {
    window.location.href = "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=65334";
  }

  async login() {
    if (!this.email || !this.password) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }
    this.loadingLogin = true;
    try {
      const { data, error } = await this.supabase.signIn(this.email, this.password);
      if (error) {
        Swal.fire('Error', 'Correo o contraseña incorrectos', 'error');
      } else {
        Swal.fire('Bienvenido/a', 'Has iniciado sesión correctamente.', 'success');
        this.cerrarModales();
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      }
    } catch {
      Swal.fire('Error', 'Ocurrió un error inesperado', 'error');
    } finally {
      this.loadingLogin = false;
    }
  }

  async register() {
    if (!this.nombre || !this.apellido || !this.tipoDocumento || !this.numeroDocumento ||
        !this.sexo || !this.edad || !this.grupoEtnico || !this.ciudad ||
        !this.emailReg || !this.confirmEmailReg || !this.passwordReg || !this.confirmPassword) {
      Swal.fire('Campos incompletos', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (this.emailReg !== this.confirmEmailReg) {
      Swal.fire('Error', 'Los correos electrónicos no coinciden', 'error');
      return;
    }

    if (this.edad < 0 || this.edad > 120) {
      Swal.fire('No permitido', 'Esa edad no esta en el rango valido', 'error');
      return;
    }
    if (this.passwordReg.length < 8) {
      Swal.fire('Contraseña débil', 'La contraseña debe tener mínimo 8 caracteres', 'error');
      return;
    }
    if (this.passwordReg !== this.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }
    this.loadingRegister = true;
    try {
      const { data, error } = await this.supabase.signUp(
        this.emailReg, 
        this.passwordReg, 
        this.nombre, 
        this.apellido,
        this.numeroDocumento,
        this.tipoDocumento,
        this.sexo,
        this.edad,
        this.grupoEtnico,
        this.ciudad
      );
      if (error) {
        Swal.fire('Error', `No se pudo completar el registro: ${error.message}`, 'error');
      }
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Se ha enviado un correo de verificación.',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => this.abrirLogin(), 2000);
    } catch {
      Swal.fire('Error', 'Ocurrió un error inesperado. Vuelva a intentarlo', 'error');
    } finally {
      this.loadingRegister = false;
    }
  }
  
  async showDepartments() {
    const { data, error } = await this.supabase.selectDepartments();
    if (error) {  
      Swal.fire('Error', 'No se pudieron cargar los departamentos', 'error'); 
      return;
    }

    this.departamentos = data ?? []
  }

  async onDepartmentChange(departmentId: string) {
    this.ciudades = [];
    
    const { data, error } = await this.supabase.selectCities(departmentId);
    if (error) {  
      Swal.fire('Error', 'No se pudieron cargar las ciudades', 'error'); 
      return;
    }

    this.ciudades = data ?? []
  }

  async showEthnicGroups() {
    const { data, error } = await this.supabase.selectEthnicGroup();
    this.gruposEtnicos = data ?? []
  }

  async showDocumentTypes() {
    const { data, error} = await this.supabase.selectDocumentTypes();
    this.tiposDocumento = data ?? []
  }
}