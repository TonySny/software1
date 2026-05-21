import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerSolicitudesComponent } from './verSolis';

describe('VerSolicitudesComponent', () => {
  let component: VerSolicitudesComponent;
  let fixture: ComponentFixture<VerSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerSolicitudesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerSolicitudesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});