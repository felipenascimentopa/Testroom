import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestaoFormPage } from './questao-form.page';

describe('QuestaoFormPage', () => {
  let component: QuestaoFormPage;
  let fixture: ComponentFixture<QuestaoFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestaoFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
