import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorWordPage } from './editor-word.page';

describe('EditorWordPage', () => {
  let component: EditorWordPage;
  let fixture: ComponentFixture<EditorWordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorWordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
