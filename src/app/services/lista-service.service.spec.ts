import { TestBed } from '@angular/core/testing';

import { ListaServiceService } from './lista-service.service';

describe('ListaServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListaServiceService = TestBed.get(ListaServiceService);
    expect(service).toBeTruthy();
  });
});
