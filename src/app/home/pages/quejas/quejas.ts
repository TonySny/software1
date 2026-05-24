import { Component } from '@angular/core';
import { PqrFormComponent } from '../../../shared/pqrs-form/pqrs-form.component';
import { PQR_CONFIGS, PqrConfig } from '../../../shared/pqrs-config';

@Component({
  selector: 'app-quejas',
  standalone: true,
  imports: [PqrFormComponent],
  templateUrl: './quejas.html',
})
export class QuejasComponent {
  config: PqrConfig = PQR_CONFIGS['queja'];
}
