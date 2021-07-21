import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetaEditarComponent } from './receta-editar.component';

describe('RecetaEditarComponent', () => {
  let component: RecetaEditarComponent;
  let fixture: ComponentFixture<RecetaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecetaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecetaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
