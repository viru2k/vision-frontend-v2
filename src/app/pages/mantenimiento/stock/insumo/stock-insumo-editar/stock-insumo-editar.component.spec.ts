import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInsumoEditarComponent } from './stock-insumo-editar.component';

describe('StockInsumoEditarComponent', () => {
  let component: StockInsumoEditarComponent;
  let fixture: ComponentFixture<StockInsumoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInsumoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInsumoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
