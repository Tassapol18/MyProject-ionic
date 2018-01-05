import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';

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


  isLoggedIn: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public afAuth: AngularFireAuth,
    ) {
  }
  BtLoggout() { 
    this.afAuth.auth.signOut()
    .then(res =>
    this.isLoggedIn = false)
    .catch(e => console.log('Error logout from Facebook', e));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
