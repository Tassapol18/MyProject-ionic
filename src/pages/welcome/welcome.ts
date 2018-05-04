import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';


//Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';


//Page
import { TabsPage } from '../tabs/tabs';



@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  authState: any = null;
  rootPage: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public fb: Facebook,
    public google: GooglePlus,
    public platform: Platform,
  ) {
    // this.afAuth.authState.subscribe((auth) => {
    //   this.authState = auth
    //   if (this.authState) {
    //     alert('Hello ' + this.authState.displayName + ' (' + this.authState.email + ')')
    //   }else{
    //     this.fb.logout();
    //   }
    // });
    // this.afAuth.authState.subscribe((auth) => {
    //   this.authState = auth
    // });
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser() {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable() {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId() {
    return this.authenticated ? this.authState.uid : '';
  }

  //FacebookLogin
  facebookLogin() {
    if (this.platform.is('cordova')) {
      return new Promise((resolve, reject) => {
        this.fb.login(['email'])
          .then((response) => {
            const facebookCredential = firebase.auth.FacebookAuthProvider
              .credential(response.authResponse.accessToken);
            firebase.auth().signInWithCredential(facebookCredential)
              .then((success) => {
                // alert("Firebase auth success : " + JSON.stringify(success));
                this.authState = success;
                this.updateUserData();
                resolve('sucess');
              })
              .catch((err) => {
                alert("Firebase auth failure : " + JSON.stringify(err));
                this.fb.logout();
                reject('fail');
              });
          }).catch((err) => {
            alert("Facebook error : " + err)
            this.fb.logout();
            reject('fail');
          });
      });
    } else {
      const provider = new firebase.auth.FacebookAuthProvider()
      return this.socialSignIn(provider);
    }

  }

  //Google
  googleLogin() {
    if (this.platform.is('cordova')) {
      return new Promise((resolve, reject) => {
        this.google.login({
          // 499658526274-2u2oiltimbh71fo887q8f3nj8ssacn89.apps.googleusercontent.com
          'webClientId': '499658526274-2u2oiltimbh71fo887q8f3nj8ssacn89.apps.googleusercontent.com',
          'offline': true
        })
          .then(res => {
            const googleCredential = firebase.auth.GoogleAuthProvider
              .credential(res.idToken);
            firebase.auth().signInWithCredential(googleCredential)
              .then(success => {
                // alert("Firebase success: " + JSON.stringify(success));
                this.authState = success;
                this.updateUserData();
                resolve('sucess');
              })
              .catch((err) => {
                alert("Firebase failure: " + JSON.stringify(err))
                reject('fail');
              });
          }).catch((err) => {
            alert("Error(fail): " + err);
            reject('fail');
          });
      });
    } else {
      const provider = new firebase.auth.GoogleAuthProvider()
      return this.socialSignIn(provider);
    }
  }

  socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user
        this.updateUserData();
      })
      .catch(error => console.log(error));
  }

  // UpdateUsertoDatabase
  updateUserData() {
    let timestamp = firebase.database.ServerValue.TIMESTAMP;
    let path = `Users/${this.currentUserId}`;
    let data = {
      email: this.authState.email,
      name: this.authState.displayName,
      profilePicture: this.authState.photoURL,
      uid: this.authState.uid,
      timestamp: timestamp
    }

    this.db.object(path).update(data)
      .catch(error => console.log(error));

  }

}
