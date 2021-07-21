import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDocumentacionDetalleComponent } from './popup-documentacion-detalle.component';

describe('PopupDocumentacionDetalleComponent', () => {
  let component: PopupDocumentacionDetalleComponent;
  let fixture: ComponentFixture<PopupDocumentacionDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupDocumentacionDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupDocumentacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
