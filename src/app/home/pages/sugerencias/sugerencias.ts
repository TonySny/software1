import { Component } from '@angular/core';
import { PqrFormComponent } from '../../../shared/pqrs-form/pqrs-form.component';
import { PQR_CONFIGS, PqrConfig } from '../../../shared/pqrs-config';

@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [PqrFormComponent],
  templateUrl: './sugerencias.html',
})
export class SugerenciasComponent {
  config: PqrConfig = PQR_CONFIGS['sugerencia'];
}
