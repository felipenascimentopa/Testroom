import { TestBed } from '@angular/core/testing';

import { QuestaoBancoService } from './questao-banco.service';

describe('QuestaoBancoService', () => {
  let service: QuestaoBancoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestaoBancoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
