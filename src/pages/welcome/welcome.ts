import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';


//Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Facebook } from '@ionic-native/facebook';



@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  authState: any = null;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public fb: Facebook,
    public platform: Platform
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
    return new Promise((resolve, reject) => {
      this.fb.login(['email']).then((response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
          .then((success) => {
            alert("Firebase auth success : " + JSON.stringify(success));
            this.authState = success;
            this.updateUserData();
            resolve('sucess');
          })
          .catch((err) => {
            alert("Firebase auth failure : " + JSON.stringify(err));
            this.fb.logout()
            reject('fail');
          });
        
      }).catch((err) => {
        alert("Facebook error : " + err)
        reject('fail');
      });
    })
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
    alert('UpdateUser' + " : " + data)

    this.db.object(path).update(data)
      .catch(error => console.log(error));

  }


}
