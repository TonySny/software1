import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {

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
  departamento = '';
  ciudad = '';
  emailReg = '';
  confirmEmailReg = '';
  passwordReg = '';
  confirmPasswordReg = '';
  loadingRegister = false;

  // Opciones para selects
  gruposEtnicos: any[] = [];
  tiposDocumento: any[] = [];
  departamentos: any[] = [];
  ciudades: any[] = [];

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
    window.location.href = 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=65334';
  }

  async documentoYaExiste(): Promise<boolean> {
    const { data } = await this.supabase.client
      .from('profiles')
      .select('id')
      .eq('dni', this.numeroDocumento)
      .maybeSingle();
    return !!data;
  }

  async forgotPassword() {
    const { value: correo } = await Swal.fire({
      title: 'Recuperar contraseña',
      input: 'email',
      inputLabel: 'Ingresa tu correo electrónico',
      inputPlaceholder: 'correo@ejemplo.com',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar',
      confirmButtonColor: '#870fa2',
    });

    if (correo) {
      const { error } = await this.supabase.client.auth.resetPasswordForEmail(correo, {
        redirectTo: 'http://localhost:4200/#/reset-password'
      });

      if (error) {
        Swal.fire('Error', 'No se pudo enviar el correo de recuperación', 'error');
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Correo enviado!',
          text: 'Revisa tu bandeja de entrada para restablecer tu contraseña.',
          confirmButtonColor: '#870fa2'
        });
      }
    }
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
        Swal.fire('¡Bienvenid@!', 'Has iniciado sesión correctamente.', 'success');
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
        !this.emailReg || !this.confirmEmailReg || !this.passwordReg || !this.confirmPasswordReg) {
      Swal.fire('Campos incompletos', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (this.emailReg !== this.confirmEmailReg) {
      Swal.fire('Error', 'Los correos electrónicos no coinciden', 'error');
      return;
    }

    if (this.edad < 18) {
      Swal.fire('No permitido', 'El sistema no permite el registro de menores de edad', 'error');
      return;
    }

    if (this.edad > 120) {
      Swal.fire('No permitido', 'Esa edad no está en el rango válido', 'error');
      return;
    }

    if (this.passwordReg.length < 8) {
      Swal.fire('Contraseña débil', 'La contraseña debe tener mínimo 8 caracteres', 'error');
      return;
    }

    if (this.passwordReg !== this.confirmPasswordReg) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    const documentoDuplicado = await this.documentoYaExiste();
    if (documentoDuplicado) {
      Swal.fire('Error', 'Ya existe un usuario registrado con ese número de documento', 'error');
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
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Se ha registrado un perfil con su cuenta de usuario',
          showConfirmButton: true
        });
        setTimeout(() => this.abrirLogin(), 2000);
      }
    } catch {
      Swal.fire('Error', 'Ha ocurrido un error inesperado. Vuelva a intentarlo', 'error');
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
    this.departamentos = data ?? [];
  }

  async onDepartmentChange(departmentId: string) {
    this.ciudad = '';
    this.ciudades = [];
    this.cdr.detectChanges();

    const { data, error } = await this.supabase.selectCities(departmentId);
    if (error) {
      Swal.fire('Error', 'No se pudieron cargar las ciudades', 'error');
      return;
    }

    this.ciudades = data ?? [];
    this.cdr.detectChanges();
  }

  async showEthnicGroups() {
    const { data, error } = await this.supabase.selectEthnicGroup();
    this.gruposEtnicos = data ?? [];
  }

  async showDocumentTypes() {
    const { data, error } = await this.supabase.selectDocumentTypes();
    this.tiposDocumento = data ?? [];
  }
}