import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelecionarQuestoesBancoPage } from './selecionar-questoes-banco.page';

describe('SelecionarQuestoesBancoPage', () => {
  let component: SelecionarQuestoesBancoPage;
  let fixture: ComponentFixture<SelecionarQuestoesBancoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecionarQuestoesBancoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
