import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './funcionario.html',
  styleUrl: './funcionario.scss',
})
export class FuncionarioComponent implements OnInit {

  nombreFuncionario = 'Funcionario';

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const session = await this.supabase.getSession();
    if (!session.data.session) {
      this.router.navigate(['/home']);
      return;
    }
    const user = session.data.session.user;
    const metadata = user.user_metadata || {};
    const nombre = metadata['full_name'];
    const apellido = metadata['full_surname'];
    this.nombreFuncionario = [nombre, apellido].filter(Boolean).join(' ') || user.email || 'Funcionario';
    this.cdr.detectChanges();
  }

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }

  editarPerfil() {
    this.router.navigate(['/funcionario/perfil']);
  }

  async logout() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#870fa2',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, salir'
    });

    if (result.isConfirmed) {
      await this.supabase.signOut();
      this.router.navigate(['/']);
    }
  }
}