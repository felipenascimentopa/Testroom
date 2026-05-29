import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntrarTurmaPage } from './entrar-turma.page';

describe('EntrarTurmaPage', () => {
  let component: EntrarTurmaPage;
  let fixture: ComponentFixture<EntrarTurmaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrarTurmaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
