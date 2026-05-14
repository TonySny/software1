import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/']);
  }

}
