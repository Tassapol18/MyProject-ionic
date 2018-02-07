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
  name: any;
  email: any;
  photo: any;
  items: any;
  showCheckin: boolean;
  showPostOwn: boolean;
  showMapPlaceOwn: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    private fb: Facebook,
    private alertCtrl: AlertController
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
        orderByChild: 'ownerUID',
        equalTo: this.afAuth.auth.currentUser.uid
      }
    });

    this.checkin = db.list('/Users/' + user.uid + '/checkIn');

    if (this.checkin != null) {
      this.showCheckin = true;
    } else {
      this.showCheckin = false;
    }

    if (this.map != null) {
      this.showMapPlaceOwn = true;
    } else {
      this.showMapPlaceOwn = false;
    }

    if (this.post != null) {
      this.showPostOwn = true;
    } else {
      this.showPostOwn = false;
    }



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
      'photo': post.photo,
      'key': post.key
    })
  }

  deletePost(post) {
    let alert = this.alertCtrl.create({
      title: 'คุณต้องการลบโพสต์ของคุณหรือไม่',
      message: 'คุณแน่ใจแล้วใช่ไหมที่จะลบ ?',
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
            firebase.storage().ref('/Posts/' + post.imageURL).delete();
          }
        }
      ]
    });
    alert.present();
    //this.post.remove(post)
    // this.post.remove(post.$key);
    // firebase.storage().ref('/Posts/' + post.imageURL).delete();

  }

  editPost(post) {
    alert('topic : ' + post.topic + ' ' +
      'detail : ' + post.detail + ' ' +
      'types : ' + post.types + ' ' +
      'timestamp : ' + post.timestamp + ' ' +
      'lat' + post.lat + ' ' +
      'lng' + post.lng + ' ' +
      'photoURL' + post.imageURL + ' ' +
      'key : ' + post.$key)
    this.navCtrl.push(EditpostPage, {
      'key': post.$key,
      'name': post.name,
      'email': post.email,
      'topic': post.topic,
      'detail': post.detail,
      'types': post.types,
      'lat': post.lat,
      'lng': post.lng,
      'photo': post.photo,
      'photoURL': post.imageURL,

    })
  }

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
      'photoPlace': map.photoPlace,
      'photoPlaceURL': map.photoPlaceURL,
      'timestamp': map.timestamp
    })
  }

  deleteMap(map) {
    let alert = this.alertCtrl.create({
      title: 'คุณต้องการลบแผนที่ของคุณหรือไม่',
      message: 'คุณแน่ใจแล้วใช่ไหมที่จะลบ ?',
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
            firebase.storage().ref('/Maps/' + map.photoPlaceURL).delete();
          }
        }
      ]
    });
    alert.present();
    // let ref = this.db.list('/Maps');
    // //this.map.remove(map)
    // let key = map.key;
    // let storagePath = map.photoPlace;
    // this.map.remove(key);
    // firebase.storage().ref('/Maps/' + storagePath).delete();
  }

  editMap(map) {
    alert('key : ' + map.$key +
      'namePlace : ' + map.namePlace +
      'typesPlace : ' + map.typesPlace +
      'detailPlace : ' + map.detailPlace +
      'placeAddress : ' + map.placeAddress +
      'timePlace : ' + map.timePlace +
      'telephonePlace : ' + map.telephonePlace +
      'websitePlace : ' + map.websitePlace +
      'lat : ' + map.lat +
      'lng : ' + map.lng +
      'photoPlaceURL' + map.photoPlaceURL)
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

  //CheckIn
  deleteCheckin(checkin) {
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
          }
        }
      ]
    });
    alert.present();
    // this.checkin.remove(checkin)
  }


  BtLoggout() {
    alert("ออกจากระบบ");
    this.afAuth.auth.signOut();
    this.fb.logout();

  }

  /*
    logout() {
    alert('คุณกำลังจะออกจากระบบ')
    this.fb.logout();

  }
  */
}
