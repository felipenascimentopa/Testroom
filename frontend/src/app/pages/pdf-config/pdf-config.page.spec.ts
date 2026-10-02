import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfConfigPage } from './pdf-config.page';

describe('PdfConfigPage', () => {
  let component: PdfConfigPage;
  let fixture: ComponentFixture<PdfConfigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
