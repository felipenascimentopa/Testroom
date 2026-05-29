import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriarTurmaPage } from './criar-turma.page';

describe('CriarTurmaPage', () => {
  let component: CriarTurmaPage;
  let fixture: ComponentFixture<CriarTurmaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarTurmaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
