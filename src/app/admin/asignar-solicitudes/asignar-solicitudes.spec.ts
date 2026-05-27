import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarSolicitudesComponent } from './asignar-solicitudes';

describe('AsignarSolicitudesComponent', () => {

  let component: AsignarSolicitudesComponent;
  let fixture: ComponentFixture<AsignarSolicitudesComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [AsignarSolicitudesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignarSolicitudesComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
