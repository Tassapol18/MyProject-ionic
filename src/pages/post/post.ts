import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  post: FirebaseListObservable<any[]>;
  postPhoto: any;
  myPhoto: any;
  myPhotoURL: any;
  lat: any;
  lng: any;

  options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  optionsSelect: CameraOptions = {
    quality: 70,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    private geolocation: Geolocation,
    private camera: Camera,
    private platform: Platform) {
    this.post = db.list('/Posts');
    this.postPhoto = firebase.storage().ref('/Posts');
  }

  addPlace() {
    this.geolocation.getCurrentPosition()
      .then((res) => {
        console.log(res.coords.latitude);
        console.log(res.coords.longitude);
      }).catch((error) => {
        console.log('Error getting location', error);
      });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.lat = data.coords.latitude;
      this.lng = data.coords.longitude;
    });
    return (this.lat, this.lng);

  }

  takePhoto() {
    this.camera.getPicture(this.options)
      .then((myPhoto) => {
        this.myPhotoURL = 'data:image/jpeg;base64,' + myPhoto;
      }, (err) => {
        console.log(err);
      });
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
    }else{
      console.log('Web');
      
    }
  }


  //add data to database
  newPost(topic, detail, types) {
    let user = firebase.auth().currentUser;
    let timestamp = firebase.database.ServerValue.TIMESTAMP;

    if (topic != null && detail != null && types != null) {
      if (this.lat == null && this.lng == null && this.myPhotoURL == null) {
        this.post.push({
          name: user.displayName,
          email: user.email,
          profilePicture: user.photoURL,
          uid: user.uid,
          detail: detail,
          types: types,
          timestamp: timestamp,
          photo: this.myPhotoURL
        }).then(newPost => {
          this.navCtrl.pop();
        }, error => {
          console.log(error);
        });
      } else if (this.lat == null && this.lng == null) {
        //Picture
        const filename = Math.floor(Date.now() / 1000);
        const imageRef = this.postPhoto.child('Post_' + filename + '.jpg');
        imageRef.putString(this.myPhotoURL, firebase.storage.StringFormat.DATA_URL)
          .then((snapshot) => {
            //alert(this.myPhotoURL)
          });
        this.post.push({
          name: user.displayName,
          email: user.email,
          profilePicture: user.photoURL,
          uid: user.uid,
          topic: topic,
          detail: detail,
          types: types,
          timestamp: timestamp,
          photo: this.myPhotoURL
        }).then(newPost => {
          this.navCtrl.pop();
        }, error => {
          console.log(error);
        });
      } else if (this.myPhotoURL == null) {
        this.post.push({
          name: user.displayName,
          email: user.email,
          profilePicture: user.photoURL,
          uid: user.uid,
          topic: topic,
          detail: detail,
          types: types,
          lat: this.lat,
          lng: this.lng,
          timestamp: timestamp,
        }).then(newPost => {
          this.navCtrl.pop();
        }, error => {
          console.log(error);
        });
      } else {
        this.post.push({
          name: user.displayName,
          email: user.email,
          profilePicture: user.photoURL,
          uid: user.uid,
          topic: topic,
          detail: detail,
          types: types,
          lat: this.lat,
          lng: this.lng,
          photo: this.myPhotoURL,
          timestamp: timestamp,
        }).then(newPost => {
          this.navCtrl.pop();
        }, error => {
          console.log(error);
        });
      }

    } else {
      alert("กรุณากรอกข้อมูล")
    }
  }




}
