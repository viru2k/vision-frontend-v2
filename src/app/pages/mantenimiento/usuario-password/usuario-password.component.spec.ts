import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioPasswordComponent } from './usuario-password.component';

describe('UsuarioPasswordComponent', () => {
  let component: UsuarioPasswordComponent;
  let fixture: ComponentFixture<UsuarioPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
