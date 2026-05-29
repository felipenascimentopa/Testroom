import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinhasTurmasPage } from './minhas-turmas.page';

describe('MinhasTurmasPage', () => {
  let component: MinhasTurmasPage;
  let fixture: ComponentFixture<MinhasTurmasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinhasTurmasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
