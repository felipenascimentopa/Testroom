import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  addOutline, trashOutline, schoolOutline, peopleOutline,
  documentTextOutline, logOutOutline, personOutline, clipboardOutline,
  folderOutline, libraryOutline, createOutline, downloadOutline,
  shareSocialOutline, settingsOutline, addCircleOutline,
  checkmarkCircle, alertCircle, timeOutline, enterOutline,
  helpCircleOutline, arrowForwardOutline, lockClosedOutline,
  mailOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true, 
  imports: [
    IonApp,    
    IonRouterOutlet  
  ]
})
export class AppComponent {
  constructor() {
    addIcons({
      addOutline, trashOutline, schoolOutline, peopleOutline,
      documentTextOutline, logOutOutline, personOutline, clipboardOutline,
      folderOutline, libraryOutline, createOutline, downloadOutline,
      shareSocialOutline, settingsOutline, addCircleOutline,
      checkmarkCircle, alertCircle, timeOutline, enterOutline,
      helpCircleOutline, arrowForwardOutline, lockClosedOutline,
      mailOutline
    });
  }
}