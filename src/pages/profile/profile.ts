import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  Users: FirebaseListObservable<any[]>;

  isLoggedIn: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public firebaseProvider: FirebaseProvider,
  ) {
    this.Users = this.firebaseProvider.getUser();
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
