import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TurmaDetalhePage } from './turma-detalhe.page';

describe('TurmaDetalhePage', () => {
  let component: TurmaDetalhePage;
  let fixture: ComponentFixture<TurmaDetalhePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TurmaDetalhePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
