import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciarQuestoesPage } from './gerenciar-questoes.page';

describe('GerenciarQuestoesPage', () => {
  let component: GerenciarQuestoesPage;
  let fixture: ComponentFixture<GerenciarQuestoesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciarQuestoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
