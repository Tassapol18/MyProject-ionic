import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';

//Page
import { WelcomePage } from '../pages/welcome/welcome';
import { TabsPage } from '../pages/tabs/tabs';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = WelcomePage;


  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe(res => {
      if (res) {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = WelcomePage;
      }
    });
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  } 
}
