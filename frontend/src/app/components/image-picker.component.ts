import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { imageOutline, trashOutline, cameraOutline } from 'ionicons/icons';
import { fileToBase64Resized, pickImageFile } from '../utils/imagem.util';

@Component({
  selector: 'app-image-picker',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon],
  template: `
    <div class="picker" [class.compact]="compact">
      <div class="preview" (click)="escolher()">
        <img *ngIf="value" [src]="value" alt="Pré-visualização" />
        <div *ngIf="!value" class="placeholder">
          <ion-icon [name]="compact ? 'camera-outline' : 'image-outline'"></ion-icon>
          <span *ngIf="!compact">Sem imagem</span>
        </div>
      </div>

      <div class="actions" *ngIf="!compact">
        <ion-button size="small" fill="outline" (click)="escolher()">
          <ion-icon slot="start" name="image-outline"></ion-icon>
          Escolher arquivo
        </ion-button>
        <ion-button size="small" fill="clear" color="danger" *ngIf="value" (click)="remover()">
          <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styles: [`
    .picker { display: flex; flex-direction: column; gap: 8px; }
    .preview {
      display: flex; align-items: center; justify-content: center;
      border: 1px dashed var(--ion-border-color);
      border-radius: 8px;
      cursor: pointer;
      overflow: hidden;
      background: var(--ion-card-background);
      min-height: 140px;
      &:hover { border-color: var(--ion-color-primary); }
    }
    .preview img { max-width: 100%; max-height: 260px; object-fit: contain; display: block; }
    .placeholder {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      color: var(--ion-color-medium);
      ion-icon { font-size: 2rem; }
      span { font-size: 0.8rem; }
    }
    .actions { display: flex; gap: 6px; }
    .compact .preview { border-radius: 50%; width: 110px; height: 110px; min-height: 110px; position: relative; }
    .compact .preview img { width: 100%; height: 100%; object-fit: cover; }
    .compact .placeholder ion-icon { font-size: 1.8rem; }
  `]
})
export class ImagePickerComponent {
  @Input() value: string | null | undefined = null;
  @Input() compact = false;
  @Output() valueChange = new EventEmitter<string | null>();

  constructor() { addIcons({ imageOutline, trashOutline, cameraOutline }); }

  async escolher() {
    const file = await pickImageFile();
    if (!file) return;
    const base64 = await fileToBase64Resized(file, this.compact ? 400 : 900);
    this.value = base64;
    this.valueChange.emit(base64);
  }

  remover() {
    this.value = null;
    this.valueChange.emit(null);
  }
}