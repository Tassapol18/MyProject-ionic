import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { EditpostPage } from '../editpost/editpost';
import { ViewpostPage } from '../viewpost/viewpost';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',

})
export class ProfilePage {

  post: FirebaseListObservable<any[]>;
  map: FirebaseListObservable<any[]>;
  checkin: FirebaseListObservable<any[]>;
  name: any;
  email: any;
  photo: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase
  ) {

    var user = firebase.auth().currentUser;


    this.name = user.displayName;
    this.email = user.email;
    this.photo = user.photoURL;


    this.post = db.list('/Posts', {
      query: {
        orderByChild: 'uid',
        equalTo: this.afAuth.auth.currentUser.uid
      }
    });
    this.map = db.list('/Maps', {
      query: {
        orderByChild: 'owenerUID',
        equalTo: this.afAuth.auth.currentUser.uid
      }
    });
    this.checkin = db.list('/Users/' + user.uid + '/checkIn');

  }

  //Post
  viewpost(post) {
    this.navCtrl.push(ViewpostPage, {
      'name': post.name,
      'email': post.email,
      'topic': post.topic,
      'detail': post.detail,
      'types': post.types,
      'timestamp': post.timestamp,
      'lat': post.lat,
      'lng': post.lng,
      'photo': post.photo
    })
  }

  deletePost(post: any) {
    this.post.remove(post)
  }

  editPost(post: any) {
    this.navCtrl.push(EditpostPage, {
      'name': post.name,
      'email': post.email,
      'topic': post.topic,
      'detail': post.detail,
      'types': post.types,
      'timestamp': post.timestamp,
      'lat': post.lat,
      'lng': post.lng,
      'photo': post.photo
    })
  }

  //Map
  viewMap(map) {
    this.navCtrl.push(ViewpostPage, {
      'name': map.name,
      'email': map.email,
      'topic': map.topic,
      'detail': map.detail,
      'types': map.types,
      'timestamp': map.timestamp,
      'lat': map.lat,
      'lng': map.lng,
      'photo': map.photo
    })
  }

  deleteMap(map: any) {
    this.map.remove(map)
  }

  editMap(map: any) {
    this.navCtrl.push(EditpostPage, {
      'name': map.name,
      'email': map.email,
      'topic': map.topic,
      'detail': map.detail,
      'types': map.types,
      'timestamp': map.timestamp,
      'lat': map.lat,
      'lng': map.lng,
      'photo': map.photo
    })
  }

  //CheckIn
  deleteCheckin(checkin: any) {
    this.checkin.remove(checkin)
  }


  BtLoggout() {
    this.afAuth.auth.signOut();
    alert("ออกจากระบบ");
  }

}
