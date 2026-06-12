import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdicionarEditarQuestaoComponent } from './adicionar-editar-questao.component';

describe('AdicionarEditarQuestaoComponent', () => {
  let component: AdicionarEditarQuestaoComponent;
  let fixture: ComponentFixture<AdicionarEditarQuestaoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdicionarEditarQuestaoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdicionarEditarQuestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
