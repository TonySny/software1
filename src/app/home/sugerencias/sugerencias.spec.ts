import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sugerencias } from './sugerencias';

describe('Sugerencias', () => {
  let component: Sugerencias;
  let fixture: ComponentFixture<Sugerencias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sugerencias],
    }).compileComponents();

    fixture = TestBed.createComponent(Sugerencias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
