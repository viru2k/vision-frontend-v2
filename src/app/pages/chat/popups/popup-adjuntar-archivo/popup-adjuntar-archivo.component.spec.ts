import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAdjuntarArchivoComponent } from './popup-adjuntar-archivo.component';

describe('PopupAdjuntarArchivoComponent', () => {
  let component: PopupAdjuntarArchivoComponent;
  let fixture: ComponentFixture<PopupAdjuntarArchivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupAdjuntarArchivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupAdjuntarArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
