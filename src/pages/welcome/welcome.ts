import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';


//Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';



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
    public platform: Platform,
    private googlePlus: GooglePlus
  ) {
    // this.afAuth.authState.subscribe((auth) => {
    //   this.authState = auth
    //   if (this.authState) {
    //     console.log('Hello ' + this.authState.displayName + ' (' + this.authState.email + ')')
    //   }
    // });
  }
  // googleLogin() {

  // }

  facebookLogin() {
    // if (this.platform.is('cordova')) {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) =>
        console.log('Logged into Facebook!', res, this.updateUserData())
      ).catch(e =>
        console.log('Error logging into Facebook', e)
      );
    // this.fb.login(['email', 'public_profile']).then(res => {
    //   const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    //   this.afAuth.auth.signInWithCredential(facebookCredential);
    //   console.log("Facebook login with cordova", res)
    //   console.log("UpdateToDatabase", this.updateUserData())
    // })
    // } else {
    //   const provider = new firebase.auth.FacebookAuthProvider()
    //   console.log("Facebook login with not is cordova", provider)
    //   return this.socialSignIn(provider);
    //   /*this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(
    //     res => {
    //       console.log("Facebook login not cordova", res)
    //       console.log("UpdateToDatabase")
    //       this.authState = res.user;
    //       this.updateUserData()
    //     }).catch(function (error) {
    //       console.log(error);
    //     });*/
    // }
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  //// Social Auth ////
  googleLogin() {
    this.googlePlus.login({})
      .then(res => console.log('Logged into GooglePlus!', res))
      .catch(err => console.error(err));
    // const provider = new firebase.auth.GoogleAuthProvider()
    // return this.socialSignIn(provider);
  }

  /*facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }*/

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  // UpdateUsertoDatabase
  updateUserData(): void {
    let path = `Users/${this.currentUserId}`;
    let data = {
      email: this.authState.email,
      name: this.authState.displayName,
      profilePicture: this.authState.photoURL,
      uid: this.authState.uid
    }

    this.db.object(path).update(data)
      .catch(error => console.log(error));

  }


}
