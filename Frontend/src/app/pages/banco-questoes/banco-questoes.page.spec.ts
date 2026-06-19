import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BancoQuestoesPage } from './banco-questoes.page';

describe('BancoQuestoesPage', () => {
  let component: BancoQuestoesPage;
  let fixture: ComponentFixture<BancoQuestoesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BancoQuestoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
