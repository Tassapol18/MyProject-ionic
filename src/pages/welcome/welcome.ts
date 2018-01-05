import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

//Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  Users: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private facebook: Facebook,
    private platform: Platform,
    public firebaseProvider: FirebaseProvider) {
    }

  fb = {
    loggedIn: true,
    name: '',
    email: '',
    profilePicture: ''
  };


  loginwithfb() {
    if (this.platform.is('cordova')) {
      return this.facebook.login(['email', 'public_profile']).then(res => {
        this.firebaseProvider.addUsers('KO1','KO2','KO3');
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          this.fb.loggedIn = true;
          this.fb.email = res.user.email;
          this.fb.name = res.user.email,
          this.fb.profilePicture = res.user.email
          this.firebaseProvider.addUsers(res.user.email,res.user.email,res.user.email);
        });
    }
  }

}
