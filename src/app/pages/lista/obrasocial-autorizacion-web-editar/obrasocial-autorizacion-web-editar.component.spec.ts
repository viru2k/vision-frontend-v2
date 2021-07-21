import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObrasocialAutorizacionWebEditarComponent } from './obrasocial-autorizacion-web-editar.component';

describe('ObrasocialAutorizacionWebEditarComponent', () => {
  let component: ObrasocialAutorizacionWebEditarComponent;
  let fixture: ComponentFixture<ObrasocialAutorizacionWebEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObrasocialAutorizacionWebEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObrasocialAutorizacionWebEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
