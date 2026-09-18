import { TestBed } from '@angular/core/testing';

import { AcessibilidadeService } from './acessibilidade.service';

describe('AcessibilidadeService', () => {
  let service: AcessibilidadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcessibilidadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
