import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcessibilidadePage } from './acessibilidade.page';

describe('AcessibilidadePage', () => {
  let component: AcessibilidadePage;
  let fixture: ComponentFixture<AcessibilidadePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AcessibilidadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
