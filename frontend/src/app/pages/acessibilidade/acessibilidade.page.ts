import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
  IonIcon, IonItem, IonLabel, IonRange, IonSegment, IonSegmentButton,
  IonToast, IonRadioGroup, IonRadio
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import {
  AcessibilidadeService, EscalaFonte, Contraste
} from '../../services/acessibilidade.service';
import { addIcons } from 'ionicons';
import {
  arrowBack, textOutline, contrastOutline, refreshOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-acessibilidade',
  templateUrl: './acessibilidade.page.html',
  styleUrls: ['./acessibilidade.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
    IonIcon, IonItem, IonLabel, IonRange, IonSegment, IonSegmentButton, IonToast, IonRadioGroup, IonRadio
  ]
})
export class AcessibilidadePage implements OnInit {
  escala: EscalaFonte = 1;
  contraste: Contraste = 'normal';
  toastMsg = '';
  toastAberto = false;

  readonly opcoesEscala: { valor: EscalaFonte; rotulo: string; exemplo: string }[] = [
    { valor: 1,    rotulo: 'Normal',       exemplo: '100%' },
    { valor: 1.15, rotulo: 'Grande',       exemplo: '115%' },
    { valor: 1.3,  rotulo: 'Muito grande', exemplo: '130%' },
    { valor: 1.5,  rotulo: 'Enorme',       exemplo: '150%' },
  ];

  constructor(
    private a11y: AcessibilidadeService,
    private router: Router
  ) {
    addIcons({ arrowBack, textOutline, contrastOutline, refreshOutline });
  }

  ngOnInit() {
    this.escala = this.a11y.getEscala();
    this.contraste = this.a11y.getContraste();
  }

  alterarEscala(e: EscalaFonte) {
    this.escala = e;
    this.a11y.setEscala(e);
    this.mostrarToast(`Fonte: ${this.opcoesEscala.find(o => o.valor === e)?.rotulo}`);
  }

  alterarContraste(c: Contraste) {
    this.contraste = c;
    this.a11y.setContraste(c);
    this.mostrarToast(`Contraste: ${c}`);
  }

  resetar() {
    this.a11y.resetar();
    this.escala = 1;
    this.contraste = 'normal';
    this.mostrarToast('Preferências restauradas');
  }

  private mostrarToast(msg: string) {
    this.toastMsg = msg;
    this.toastAberto = true;
  }

  voltar() {
    this.router.navigate(['/menu']);
  }
}