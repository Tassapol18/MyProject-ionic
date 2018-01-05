import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  isLoggedIn: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth
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
