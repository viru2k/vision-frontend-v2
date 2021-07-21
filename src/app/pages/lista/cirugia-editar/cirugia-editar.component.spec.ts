import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CirugiaEditarComponent } from './cirugia-editar.component';

describe('CirugiaEditarComponent', () => {
  let component: CirugiaEditarComponent;
  let fixture: ComponentFixture<CirugiaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CirugiaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CirugiaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
