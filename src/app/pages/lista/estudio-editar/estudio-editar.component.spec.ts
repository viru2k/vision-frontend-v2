import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudioEditarComponent } from './estudio-editar.component';

describe('EstudioEditarComponent', () => {
  let component: EstudioEditarComponent;
  let fixture: ComponentFixture<EstudioEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstudioEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudioEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
