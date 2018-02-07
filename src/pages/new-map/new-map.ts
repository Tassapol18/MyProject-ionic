import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  data: any;
  lat: any;
  lng: any;
  mapPhoto: any;
  photoPlace: any;
  photoPlaceURL: any;
  showPhotoUpload: boolean;

  options: CameraOptions = {
    quality: 80,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.CAMERA,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.ALLMEDIA,
    saveToPhotoAlbum: true,
    correctOrientation: true
  }

  optionsSelect: CameraOptions = {
    quality: 80,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  }


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    private geolocation: Geolocation,
    private camera: Camera) {
    this.showPhotoUpload = false;
  }

  getPlace() {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition()
        .then((res) => {
          this.lat = res.coords.latitude;
          this.lng = res.coords.longitude;
          resolve('success');
        }).catch((err) => {
          reject('fail' + err)
        });
    })
    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => { });
    // return this.lat, this.lng;

  }

  resetLatLng() {
    return this.lat = null, this.lng = null;
  }

  /*
  photoPlace: any;
  photoPlaceURL: any;
  */

  //Camera
  takePhoto() {
    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.options)
        .then((myPhoto) => {
          this.photoPlace = 'data:image/jpeg;base64,' + myPhoto;
          this.upLoadImage();
          resolve('send picture to upload');
        }, (err) => {
          reject('fail : ' + err);
        });
    })
  }

  selectPhoto() {
    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.optionsSelect)
        .then((myPhoto) => {
          this.photoPlace = 'data:image/jpeg;base64,' + myPhoto;
          this.upLoadImage();
          resolve('send picture to upload');
        }, (err) => {
          reject('fail : ' + err);
        });
    })

  }

  //DeletePhoto
  deletePhotoUpload() {
    alert('Delete Photo now : ' + this.photoPlaceURL)
    firebase.storage().ref('/Maps/' + this.photoPlaceURL).delete();
    this.photoPlace = null;
    this.photoPlaceURL = null;
    this.showPhotoUpload = false;
  }

  //Upload Image
  upLoadImage() {
    alert('Func uploadImage')
    this.mapPhoto = firebase.storage().ref('/Maps');
    const filename = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
      this.photoPlaceURL = 'Maps_' + filename;
      const imageRef = this.mapPhoto.child(this.photoPlaceURL);
      imageRef.putString(this.photoPlace, firebase.storage.StringFormat.DATA_URL)
        .then(() => {
          alert('Upload Success : ' + imageRef)
          this.showPhotoUpload = true;
          resolve('Upload Image Success')
        }).catch((err) => {
          alert('Upload Unsuccess : ' + err)
          reject('fail : ' + err)
        });
    })
  }

  newMaps(namePlace, typesPlace, detailPlace, placeAddress, timePlace, telephonePlace, websitePlace) {
    let user = firebase.auth().currentUser;
    let timestamp = firebase.database.ServerValue.TIMESTAMP;

    alert('This function newMaps => '
      + ' //ownerPlace : ' + user.displayName
      + ' //ownerUID : ' + user.uid
      + ' //namePlace : ' + namePlace
      + ' //typesPlace : ' + typesPlace
      + ' //detailPlace : ' + detailPlace
      + ' //placeAddress : ' + placeAddress
      + ' //timePlace : ' + timePlace
      + ' //telephonePlace : ' + telephonePlace
      + ' //websitePlace : ' + websitePlace
      + ' //lat : ' + this.lat
      + ' //lng : ' + this.lng
      + ' //imageURL : ' + this.photoPlaceURL
      + ' //timestamp : ' + timestamp);

      if(namePlace && typesPlace && detailPlace != null){
        this.data = {
          ownerPlace: user.displayName,
          ownerUID: user.uid,
          namePlace: namePlace,
          typesPlace: typesPlace,
          detailPlace: detailPlace,
          placeAddress: (placeAddress) ? placeAddress : '-',
          timePlace: (timePlace) ? timePlace : '-',
          telephonePlace: (telephonePlace) ? telephonePlace : '-',
          websitePlace: (websitePlace) ? websitePlace : '-',
          lat: this.lat,
          lng: this.lng,
          photoPlace: (this.photoPlace) ? this.photoPlace : null,
          photoPlaceURL: (this.photoPlaceURL) ? this.photoPlaceURL : null,
          timestamp: timestamp,
        }
        alert('Use func uploadMap');
        this.uploadMap();
      }else{
        alert('กรุณากรอกข้อมูล * ให้ครบถ้วน')
      }
    
  }

  uploadMap() {
    alert('Func uploadMap')
    this.maps = this.db.list('/Maps');
    return new Promise((resolve, reject) => {
      this.maps.push(this.data).then((res) => {
        alert('บันทึกข้อมูลสำเร็จ : ' + res);
        this.navCtrl.pop();
        resolve('Success');
      }, err => {
        alert('บันทึกข้อมูลไม่สำเร็จ : ' + err);
        reject('Unsuccess');
      });
    })
  }


}

/*
if (namePlace != null && detailPlace != null && typesPlace != null) {
      if (this.myPhoto != null) {
        const filename = Math.floor(Date.now() / 1000);
        const imageRef = this.mapPhoto.child('Post_' + filename + '.jpg');
        imageRef.putString(this.myPhoto, firebase.storage.StringFormat.DATA_URL)
          .then((snapshot) => {
            //alert(this.myPhoto)
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
          photoPlace: this.myPhoto,
          lat: this.lat,
          lng: this.lng
        }).then(newPost => {
          this.navCtrl.pop();
          //this.navCtrl.setRoot(TabsPage);
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
 */