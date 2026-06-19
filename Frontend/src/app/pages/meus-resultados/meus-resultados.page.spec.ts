import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeusResultadosPage } from './meus-resultados.page';

describe('MeusResultadosPage', () => {
  let component: MeusResultadosPage;
  let fixture: ComponentFixture<MeusResultadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeusResultadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
