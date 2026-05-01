import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuejasComponent } from './quejas';

describe('QuejasComponent', () => {
  let component: QuejasComponent;
  let fixture: ComponentFixture<QuejasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuejasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuejasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
