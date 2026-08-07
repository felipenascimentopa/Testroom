import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestaoPage } from './questao.page';

describe('QuestaoPage', () => {
  let component: QuestaoPage;
  let fixture: ComponentFixture<QuestaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
