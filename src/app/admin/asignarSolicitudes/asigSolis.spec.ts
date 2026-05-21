import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignarSolicitudesComponent } from './asigSolis';

describe('AsignarSolicitudesComponent', () => {
  let component: AsignarSolicitudesComponent;
  let fixture: ComponentFixture<AsignarSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarSolicitudesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignarSolicitudesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});