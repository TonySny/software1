import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarUsuariosComponent } from './gesUser';

describe('GestionarUsuariosComponent', () => {
  let component: GestionarUsuariosComponent;
  let fixture: ComponentFixture<GestionarUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarUsuariosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionarUsuariosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});