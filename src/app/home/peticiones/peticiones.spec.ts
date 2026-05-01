import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Peticiones } from './peticiones';

describe('Peticiones', () => {
  let component: Peticiones;
  let fixture: ComponentFixture<Peticiones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Peticiones],
    }).compileComponents();

    fixture = TestBed.createComponent(Peticiones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
