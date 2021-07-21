import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CirugiaGrupoMedicoComponent } from './cirugia-grupo-medico.component';

describe('CirugiaGrupoMedicoComponent', () => {
  let component: CirugiaGrupoMedicoComponent;
  let fixture: ComponentFixture<CirugiaGrupoMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CirugiaGrupoMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CirugiaGrupoMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
