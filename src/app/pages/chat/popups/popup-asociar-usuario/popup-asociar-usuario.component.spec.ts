import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAsociarUsuarioComponent } from './popup-asociar-usuario.component';

describe('PopupAsociarUsuarioComponent', () => {
  let component: PopupAsociarUsuarioComponent;
  let fixture: ComponentFixture<PopupAsociarUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupAsociarUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupAsociarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
