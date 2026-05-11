import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarComponent } from './consultar';

describe('ConsultarComponent', () => {
  let component: ConsultarComponent;
  let fixture: ComponentFixture<ConsultarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});