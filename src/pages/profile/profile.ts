import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {
  }
  BtLoggout() {
    this.app.getRootNav().setRoot(WelcomePage);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
