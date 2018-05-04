import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { StatusBar } from '@ionic-native/status-bar';
import firebase from 'firebase';
import { EditpostPage } from '../editpost/editpost';
import { ViewpostPage } from '../viewpost/viewpost';
import { Facebook } from '@ionic-native/facebook';
import { EditmapPage } from '../editmap/editmap';
import { ViewmapPage } from '../viewmap/viewmap';
import len from 'object-length';
import moment from 'moment';


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
    public statusBar: StatusBar,
    public db: AngularFireDatabase,
    private fb: Facebook,
    private alertCtrl: AlertController, ) {
    statusBar.backgroundColorByHexString('#0026a3');
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

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString('#0026a3');
  }

  viewDate(date){
    moment.locale('th');
    let time = moment(date).format('LLL')
    return time;
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
  viewPost(post) {
    this.navCtrl.push(ViewpostPage, {
      'key': post.$key,
      'name': post.name,
      'email': post.email,
      'topic': post.topic,
      'detail': post.detail,
      'types': post.types,
      'timestamp': post.timestamp,
      'lat': post.lat,
      'lng': post.lng,
      'photoPostURL': post.photoPostURL,
      'view': len(post.view)
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
            if (post.photoPost == '-') {
              this.post.remove(post.$key);
            } else {
              for (let i = 0; i < len(post.photoPost); i++) {
                firebase.storage().ref('/Posts/' + post.photoPost[i]).delete();
                this.post.remove(post.$key);
              }
            }
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
    this.navCtrl.push(ViewmapPage, {
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
      'timestamp': map.timestamp,
      'ownerPlace': this.user.displayName,
      'ownerUID': this.user.uid
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

            if (map.photoPlace == '-') {            
              this.map.remove(map.$key);              
            } else {
              for (let i = 0; i < len(map.photoPlace); i++) {
                firebase.storage().ref('/Maps/' + map.photoPlace[i]).delete();
                this.map.remove(map.$key);
              }
            }

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
          }
        }
      ]
    });
    alt.present();
  }

}
