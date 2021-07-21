import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObrasocialAutorizacionWebComponent } from './obrasocial-autorizacion-web.component';

describe('ObrasocialAutorizacionWebComponent', () => {
  let component: ObrasocialAutorizacionWebComponent;
  let fixture: ComponentFixture<ObrasocialAutorizacionWebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObrasocialAutorizacionWebComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObrasocialAutorizacionWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
