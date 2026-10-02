import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorAtividadePage } from './editor-atividade.page';

describe('EditorAtividadePage', () => {
  let component: EditorAtividadePage;
  let fixture: ComponentFixture<EditorAtividadePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorAtividadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
