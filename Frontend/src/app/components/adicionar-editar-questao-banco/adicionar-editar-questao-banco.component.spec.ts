import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdicionarEditarQuestaoBancoComponentPage } from './adicionar-editar-questao-banco.component';

describe('AdicionarEditarQuestaoBancoComponentPage', () => {
  let component: AdicionarEditarQuestaoBancoComponentPage;
  let fixture: ComponentFixture<AdicionarEditarQuestaoBancoComponentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarEditarQuestaoBancoComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
