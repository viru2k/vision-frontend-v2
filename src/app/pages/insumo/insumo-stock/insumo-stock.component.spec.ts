import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumoStockComponent } from './insumo-stock.component';

describe('InsumoStockComponent', () => {
  let component: InsumoStockComponent;
  let fixture: ComponentFixture<InsumoStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumoStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
