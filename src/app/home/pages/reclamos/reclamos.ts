import { Component } from '@angular/core';
import { PqrFormComponent } from '../../../shared/pqrs-form/pqrs-form.component';
import { PQR_CONFIGS, PqrConfig } from '../../../shared/pqrs-config';

@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [PqrFormComponent],
  templateUrl: './reclamos.html',
})
export class ReclamosComponent {
  config: PqrConfig = PQR_CONFIGS['reclamo'];
}
