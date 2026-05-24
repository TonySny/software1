import { Component } from '@angular/core';
import { PqrFormComponent } from '../../../shared/pqrs-form/pqrs-form.component';
import { PQR_CONFIGS, PqrConfig } from '../../../shared/pqrs-config';

@Component({
  selector: 'app-peticiones',
  standalone: true,
  imports: [PqrFormComponent],
  templateUrl: './peticiones.html',
})
export class PeticionesComponent {
  config: PqrConfig = PQR_CONFIGS['peticion'];
}
