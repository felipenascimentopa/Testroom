import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerarAtividadePage } from './gerar-atividade.page';

describe('GerarAtividadePage', () => {
  let component: GerarAtividadePage;
  let fixture: ComponentFixture<GerarAtividadePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GerarAtividadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
