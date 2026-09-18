import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type EscalaFonte = 1 | 1.15 | 1.3 | 1.5;
export type Contraste = 'normal' | 'alto' | 'ultra';

@Injectable({ providedIn: 'root' })
export class AcessibilidadeService {
  private readonly KEY_ESCALA = 'a11y_escala_fonte';
  private readonly KEY_CONTRASTE = 'a11y_contraste';

  private escalaSubject = new BehaviorSubject<EscalaFonte>(1);
  private contrasteSubject = new BehaviorSubject<Contraste>('normal');

  escala$: Observable<EscalaFonte> = this.escalaSubject.asObservable();
  contraste$: Observable<Contraste> = this.contrasteSubject.asObservable();

  constructor() {
    this.carregar();
  }

  carregar() {
    const escala = Number(localStorage.getItem(this.KEY_ESCALA) || '1') as EscalaFonte;
    const contraste = (localStorage.getItem(this.KEY_CONTRASTE) as Contraste) || 'normal';
    this.aplicarEscala(escala);
    this.aplicarContraste(contraste);
  }

  setEscala(escala: EscalaFonte) {
    localStorage.setItem(this.KEY_ESCALA, String(escala));
    this.aplicarEscala(escala);
  }

  setContraste(contraste: Contraste) {
    localStorage.setItem(this.KEY_CONTRASTE, contraste);
    this.aplicarContraste(contraste);
  }

  getEscala(): EscalaFonte {
    return this.escalaSubject.value;
  }

  getContraste(): Contraste {
    return this.contrasteSubject.value;
  }

  resetar() {
    this.setEscala(1);
    this.setContraste('normal');
  }

  private aplicarEscala(escala: EscalaFonte) {
    const app = document.querySelector('ion-app') as HTMLElement | null;
    if (app) {
      app.style.zoom = String(escala);
    }
    this.escalaSubject.next(escala);
  }

  private aplicarContraste(contraste: Contraste) {
    document.documentElement.dataset['contrast'] = contraste;
    this.contrasteSubject.next(contraste);
  }
}