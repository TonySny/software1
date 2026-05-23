import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeticionesComponent } from './peticiones';

describe('Peticiones', () => {
  let component: PeticionesComponent;
  let fixture: ComponentFixture<PeticionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeticionesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeticionesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
