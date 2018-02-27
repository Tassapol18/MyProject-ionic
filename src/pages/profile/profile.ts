import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { EditpostPage } from '../editpost/editpost';
import { ViewpostPage } from '../viewpost/viewpost';
import { Facebook } from '@ionic-native/facebook';
import { EditmapPage } from '../editmap/editmap';
import { MapownPage } from '../mapown/mapown';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',

})
export class ProfilePage {

  post: FirebaseListObservable<any[]>;
  map: FirebaseListObservable<any[]>;
  checkin: FirebaseListObservable<any[]>;
  checkinPlace: FirebaseListObservable<any[]>;

  name: any;
  email: any;
  photo: any;
  items: any;
  showCheckinOwn: boolean = false;
  showPostOwn: boolean = false;
  showMapPlaceOwn: boolean = false;
  user: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    private fb: Facebook,
    private alertCtrl: AlertController
  ) {

    this.user = firebase.auth().currentUser;


    this.name = this.user.displayName;
    this.email = this.user.email;
    this.photo = this.user.photoURL;


    this.post = db.list('/Posts', {
      query: {
        orderByChild: 'uid',
        equalTo: this.user.uid
      }
    });
    this.map = db.list('/Maps', {
      query: {
        orderByChild: 'ownerUID',
        equalTo: this.user.uid
      }
    });

    this.checkin = this.db.list('/Users/' + this.user.uid + '/CheckIn', {
      query: {
        limitToLast: 5
      }
    });
    

    if (this.checkin != null) {
      this.showCheckinOwn = true;
    }

    if (this.map != null) {
      this.showMapPlaceOwn = true;
    }

    if (this.post != null) {
      this.showPostOwn = true;
    }

  }

  //CheckIn
  /*
  deleteCheckin(checkin) {

    this.checkinPlace = this.db.list('/Maps/' + checkin.keyPlace + '/CheckIn/');
    let alert = this.alertCtrl.create({
      title: 'คุณต้องการลบ Check-in ของคุณหรือไม่',
      message: 'คุณแน่ใจแล้วใช่ไหมที่จะลบ ?',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'ฉันต้องการลบ',
          handler: () => {
            this.checkin.remove(checkin.$key)
            this.checkinPlace.remove();
          }
        }
      ]
    });
    alert.present();
    // this.checkin.remove(checkin)
  }
*/

  /////////////////////////////////////////////////////////////////////////////////////////

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
      'photoPostURL': post.photoPostURL,
    })
  }

  deletePost(post) {

    let alert = this.alertCtrl.create({
      title: 'คุณต้องการลบกระดานข่าวของคุณหรือไม่',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'ฉันต้องการลบ',
          handler: () => {
            this.post.remove(post.$key);
            firebase.storage().ref('/Posts/' + post.photoPost).delete();
          }
        }
      ]
    });
    alert.present();
  }

  editPost(post) {
    this.navCtrl.push(EditpostPage, {
      'key': post.$key,
      'topic': post.topic,
      'detail': post.detail,
      'types': post.types,
      'lat': post.lat,
      'lng': post.lng,
      'photoPost': post.photoPost,
      'photoPostURL': post.photoPostURL
    })
  }

  /////////////////////////////////////////////////////////////////////////////////////////

  //Map
  viewMap(map) {
    this.navCtrl.push(MapownPage, {
      'namePlace': map.namePlace,
      'typesPlace': map.typesPlace,
      'detailPlace': map.detailPlace,
      'placeAddress': map.placeAddress,
      'timePlace': map.timePlace,
      'telephonePlace': map.telephonePlace,
      'websitePlace': map.websitePlace,
      'lat': map.lat,
      'lng': map.lng,
      'photoPlaceURL': map.photoPlaceURL,
      'timestamp': map.timestamp
    })
  }

  deleteMap(map) {
    let alt = this.alertCtrl.create({
      title: 'คุณต้องการลบสถานที่ของคุณหรือไม่',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'ฉันต้องการลบ',
          handler: () => {

            this.map.remove(map.$key);
            firebase.storage().ref('/Maps/' + map.photoPlace).delete();
          }
        }
      ]
    });
    alt.present();
  }

  editMap(map) {
    this.navCtrl.push(EditmapPage, {
      'key': map.$key,
      'namePlace': map.namePlace,
      'typesPlace': map.typesPlace,
      'detailPlace': map.detailPlace,
      'placeAddress': map.placeAddress,
      'timePlace': map.timePlace,
      'telephonePlace': map.telephonePlace,
      'websitePlace': map.websitePlace,
      'lat': map.lat,
      'lng': map.lng,
      'photoPlace': map.photoPlace,
      'photoPlaceURL': map.photoPlaceURL
    })
  }




  BtLoggout() {
    let alt = this.alertCtrl.create({
      title: 'คุณต้องการออกจากระบบใช่หรือไม่',
      buttons: [
        {
          text: 'ไม่ต้องการ',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'ออกจากระบบ',
          handler: () => {
            this.afAuth.auth.signOut();
            this.fb.logout();
          }
        }
      ]
    });
    alt.present();
  }

}
