import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButtons, IonLabel, IonIcon, IonList, IonMenuButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForwardCircle, exit, grid, list, person } from 'ionicons/icons';

@Component({
     selector: 'app-menu',
     templateUrl: './menu.page.html',
     styleUrls: ['./menu.page.scss'],
     standalone: true,
     imports: [IonList, IonIcon, IonLabel, IonButtons, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, RouterModule, CommonModule, FormsModule]
})
export class MenuPage implements OnInit {

     constructor() {
          addIcons({ grid, list, arrowForwardCircle, person, exit });
     }

     menu = [
          { descricao: "Sair", rota: "/login", icone: "exit", cor: "danger" }
     ];

     ngOnInit() {
     }

}