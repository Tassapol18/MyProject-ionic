import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-new-map',
  templateUrl: 'new-map.html',
})
export class NewMapPage {

  maps: FirebaseListObservable<any[]>;
  lat: any;
  lng: any;
  mapPhoto: any;
  myPhoto: any;
  myPhotoURL: any;

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
    this.maps = db.list('/Maps');
    this.mapPhoto = firebase.storage().ref('/Maps');
  }

  getPlace() {
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

  // takePhoto() {
  //   this.camera.getPicture(this.options)
  //     .then((myPhoto) => {
  //       this.myPhotoURL = 'data:image/jpeg;base64,' + myPhoto;
  //     }, (err) => {
  //       console.log(err);
  //     });
  // }

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

  newMaps(namePlace, detailPlace, typesPlace, placeAddress, timePlace, telephonePlace, websitePlace) {
    let user = firebase.auth().currentUser;
    let timestamp = firebase.database.ServerValue.TIMESTAMP;

    if (namePlace != null && detailPlace != null && typesPlace != null) {
      if (this.myPhotoURL != null) {
        const filename = Math.floor(Date.now() / 1000);
        const imageRef = this.mapPhoto.child('Post_' + filename);
        imageRef.putString(this.myPhotoURL, firebase.storage.StringFormat.DATA_URL)
          .then((snapshot) => {
            //alert(this.myPhotoURL)
          });
        this.maps.push({
          owener: user.displayName,
          owenerUID: user.uid,
          namePlace: namePlace,
          detailPlace: detailPlace,
          typesPlace: typesPlace,
          placeAddress: placeAddress,
          timePlace: timePlace,
          telephonePlace: telephonePlace,
          websitePlace: websitePlace,
          timestamp: timestamp,
          photoPlace: this.myPhotoURL,
          lat: this.lat,
          lng: this.lng
        }).then(newPost => {
          this.navCtrl.pop();
        }, error => {
          console.log(error);
        });
      } else {
        //don't have Picture
        this.maps.push({
          owener: user.displayName,
          owenerUID: user.uid,
          namePlace: namePlace,
          detailPlace: detailPlace,
          typesPlace: typesPlace,
          placeAddress: placeAddress,
          timePlace: timePlace,
          telephonePlace: telephonePlace,
          websitePlace: websitePlace,
          photoPlace: '../../assets/imgs/iconMap/noPicture.png',
          timestamp: timestamp,
          lat: this.lat,
          lng: this.lng
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
