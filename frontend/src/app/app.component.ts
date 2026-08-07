import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBack, add, createOutline, trashOutline, shareSocialOutline,
  folderOutline, helpCircleOutline, personOutline, copyOutline,
  closeOutline
} from 'ionicons/icons';

addIcons({ arrowBack, add, createOutline, trashOutline, shareSocialOutline,
  folderOutline, helpCircleOutline, personOutline, copyOutline, closeOutline });

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  
})
export class AppComponent {
  constructor() {}
}