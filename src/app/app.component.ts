import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { WelcomePage } from '../pages/welcome/welcome';

import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../pages/tabs/tabs';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private afAuth: AngularFireAuth) {

    // this.afAuth.authState.subscribe(res => {
    //   if (res) {
    //     this.rootPage = TabsPage;
    //     console.log("Welcome to CountryTrip");
    //   } else {
    //     this.rootPage = WelcomePage;
    //     console.log("Welcome!!");
    //   }
    // });

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
