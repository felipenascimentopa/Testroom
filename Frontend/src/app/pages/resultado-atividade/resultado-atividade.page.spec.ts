import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultadoAtividadePage } from './resultado-atividade.page';

describe('ResultadoAtividadePage', () => {
  let component: ResultadoAtividadePage;
  let fixture: ComponentFixture<ResultadoAtividadePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoAtividadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
