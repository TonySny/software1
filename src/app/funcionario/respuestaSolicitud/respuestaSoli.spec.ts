import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleSolicitudComponent } from './respuestaSoli';

describe('DetalleSolicitudComponent', () => {
  let component: DetalleSolicitudComponent;
  let fixture: ComponentFixture<DetalleSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleSolicitudComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleSolicitudComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});