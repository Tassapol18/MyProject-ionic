import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-editpost',
  templateUrl: 'editpost.html',
})
export class EditpostPage {
  post: FirebaseListObservable<any[]>;

  name: any;
  email: any;
  topic: any;
  detail: any;
  types: any;
  timestamp: any;
  lat: any;
  lng: any;
  photo: any;

  myPhoto: any;
  myPhotoURL: any;

  optionsSelect: CameraOptions = {
    quality: 70,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
  }

  constructor(public navCtrl: NavController,
    private camera: Camera,
    private platform: Platform,
    public navParams: NavParams,
    public db: AngularFireDatabase) {

    this.name = navParams.get('name');
      this.email = navParams.get('email');
      this.topic = navParams.get('topic');
      this.detail = navParams.get('detail');
      this.types = navParams.get('types');
      this.timestamp = navParams.get('timestamp');
      this.lat = navParams.get('lat');
      this.lng = navParams.get('lng');
      this.photo = navParams.get('photo');

      this.post = db.list('/Posts');
  }
  
  selectPhoto() {
    if (this.platform.is('cordova')) {
      console.log('Cordova');

      this.camera.getPicture(this.optionsSelect)
        .then((myPhoto) => {
          this.myPhotoURL = 'data:image/jpeg;base64,' + myPhoto;
        }, (err) => {
          console.log(err);
        });
    } else {
      console.log('Web');
      // .getMetadata().then(function(metadata) {
      //   // Metadata now contains the metadata for 'images/forest.jpg'
      // }).catch(function(error) {
      //   // Uh-oh, an error occurred!
      // });

    }
  }

  updatePost() {
    console.log(
      this.name,
      this.email,
      this.topic,
      this.detail,
      this.types,
      this.timestamp,
      this.lat,
      this.lng,
      this.photo,
    );
    var timestamp = firebase.database.ServerValue.TIMESTAMP;

  }



  // updatePost(topic, detail, types) {
  //   var user = firebase.auth().currentUser;
  //   var timestamp = firebase.database.ServerValue.TIMESTAMP;
  //   if (topic != null && detail != null && types != null) {
  //     console.log(
  //       user.displayName,  //name
  //       user.email,
  //       user.photoURL,
  //       user.uid,
  //       topic,
  //       detail,
  //       types,
  //       timestamp);
  //     this.post.set(user.uid, {topic, detail, types});
  //     /*this.post.push({
  //       name: user.displayName,
  //       email: user.email,
  //       profilePicture: user.photoURL,
  //       topic: topic,
  //       detail: detail,
  //       types: types,
  //       timestamp: timestamp
  //     }).then(newPost => {
  //       this.navCtrl.pop();
  //     }, error => {
  //       console.log(error);
  //     });
  //   } else {
  //     alert("กรุณากรอกข้อมูล")
  //   }*/
  //   }

  // }


  ionViewDidLoad() {
    console.log('ionViewDidLoad EditpostPage');
  }

}
