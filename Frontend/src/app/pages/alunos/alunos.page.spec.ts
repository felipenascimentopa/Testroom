import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlunosPage } from './alunos.page';

describe('AlunosPage', () => {
  let component: AlunosPage;
  let fixture: ComponentFixture<AlunosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlunosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
