import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponderAtividadePage } from './responder-atividade.page';

describe('ResponderAtividadePage', () => {
  let component: ResponderAtividadePage;
  let fixture: ComponentFixture<ResponderAtividadePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponderAtividadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
