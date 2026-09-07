import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-visualizar-atividade',
  templateUrl: './visualizar-atividade.page.html',
  styleUrls: ['./visualizar-atividade.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class VisualizarAtividadePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  async baixarPdf() {
    this.atividadeService.exportarPdf(this.atividadeId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `atividade_${this.atividadeId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: async (err) => {
      }
    });
}
}
