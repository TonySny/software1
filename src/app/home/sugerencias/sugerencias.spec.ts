import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugerenciasComponent } from './sugerencias';

describe('SugerenciasComponent', () => {
  let component: SugerenciasComponent;
  let fixture: ComponentFixture<SugerenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SugerenciasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SugerenciasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
