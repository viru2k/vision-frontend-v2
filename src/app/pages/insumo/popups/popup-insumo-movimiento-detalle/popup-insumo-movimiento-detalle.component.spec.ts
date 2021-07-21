import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupInsumoMovimientoDetalleComponent } from './popup-insumo-movimiento-detalle.component';

describe('PopupInsumoMovimientoDetalleComponent', () => {
  let component: PopupInsumoMovimientoDetalleComponent;
  let fixture: ComponentFixture<PopupInsumoMovimientoDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupInsumoMovimientoDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupInsumoMovimientoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
