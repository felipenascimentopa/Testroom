import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualizarAtividadePage } from './visualizar-atividade.page';

describe('VisualizarAtividadePage', () => {
  let component: VisualizarAtividadePage;
  let fixture: ComponentFixture<VisualizarAtividadePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarAtividadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
