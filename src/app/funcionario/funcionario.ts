import { Component } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [],
  templateUrl: './funcionario.html',
  styleUrl: './funcionario.scss'
})
export class FuncionarioComponent {

  nombreFuncionario: string = 'Carlos Rodríguez';

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/']);
  }

  editarPerfil() {
    alert('Función editar perfil próximamente');
  }

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }

}
