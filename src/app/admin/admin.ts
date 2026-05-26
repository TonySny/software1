import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent {
  nombreAdmin = 'Administrador';

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/']);
  }

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }
}