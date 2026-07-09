import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarAtividadeComponentPage } from './editar-atividade.component';

describe('EditarAtividadeComponentPage', () => {
  let component: EditarAtividadeComponentPage;
  let fixture: ComponentFixture<EditarAtividadeComponentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarAtividadeComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
