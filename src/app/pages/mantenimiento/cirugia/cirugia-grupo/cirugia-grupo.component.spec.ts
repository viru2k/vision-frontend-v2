import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CirugiaGrupoComponent } from './cirugia-grupo.component';

describe('CirugiaGrupoComponent', () => {
  let component: CirugiaGrupoComponent;
  let fixture: ComponentFixture<CirugiaGrupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CirugiaGrupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CirugiaGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
