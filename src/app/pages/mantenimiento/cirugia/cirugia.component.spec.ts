import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CirugiaComponent } from './cirugia.component';

describe('CirugiaComponent', () => {
  let component: CirugiaComponent;
  let fixture: ComponentFixture<CirugiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CirugiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CirugiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
