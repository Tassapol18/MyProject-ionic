import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-editmap',
  templateUrl: 'editmap.html',
})
export class EditmapPage {

  map: any;
  mapPhoto: any;

  key: any;
  namePlace: any;
  typesPlace: any;
  detailPlace: any;
  placeAddress: any;
  timePlace: any;
  telephonePlace: any;
  websitePlace: any;
  lat: any;
  lng: any;
  photoPlace: any;
  photoPlaceURL: any;
  showPhotoUpload: boolean = false;
  data: any;

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
    private camera: Camera,
    private geolocation: Geolocation) {

    this.key = navParams.get('key');
    this.namePlace = navParams.get('namePlace');
    this.typesPlace = navParams.get('typesPlace');
    this.detailPlace = navParams.get('detailPlace');
    this.placeAddress = navParams.get('placeAddress');
    this.timePlace = navParams.get('timePlace');
    this.telephonePlace = navParams.get('telephonePlace');
    this.websitePlace = navParams.get('websitePlace');
    this.lat = navParams.get('lat');
    this.lng = navParams.get('lng');
    this.photoPlace = navParams.get('photoPlace');
    this.photoPlaceURL = navParams.get('photoPlaceURL');

    if (this.photoPlace != null) {
      this.showPhotoUpload = true;
    } else {
      this.showPhotoUpload = false;
    }
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

  //DeletePhoto
  deletePhotoUpload() {
    alert('Delete Photo now : ' + this.photoPlaceURL)
    firebase.storage().ref('/Maps/' + this.photoPlaceURL).delete();
    this.photoPlace = null;
    this.photoPlaceURL = null;
    this.showPhotoUpload = false;
  }

  editMap(namePlace, typesPlace, detailPlace, placeAddress, timePlace, telephonePlace, websitePlace) {
    let user = firebase.auth().currentUser;

    alert('This function editMap => '
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
      + ' //photoPlaceURL : ' + this.photoPlaceURL);

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
        }
        alert('Use func uploadMap');
        // alert('This function editMap => '
        // + ' //ownerPlace : ' + this.data.ownerPlace
        // + ' //ownerUID : ' + this.data.ownerUID
        // + ' //namePlace : ' + this.data.namePlace
        // + ' //typesPlace : ' + this.data.typesPlace
        // + ' //detailPlace : ' + this.data.detailPlace
        // + ' //placeAddress : ' + this.data.placeAddress
        // + ' //timePlace : ' + this.data.timePlace
        // + ' //telephonePlace : ' + this.data.telephonePlace
        // + ' //websitePlace : ' + this.data.websitePlace
        // + ' //lat : ' + this.data.lat
        // + ' //lng : ' + this.data.lng
        // + ' //photoPlaceURL : ' + this.data.photoPlaceURL);
        // alert('photoPlace : ' + this.data.photoPlace)
        this.updateFromEdit();
      }else{
        alert('กรุณากรอกข้อมูล * ให้ครบถ้วน');

      }
    
  }

  updateFromEdit() {
    alert('Func updateFromEdit');
    this.map = this.db.object('/Maps/' + this.key);
    alert('this.data update => '
    + ' //ownerPlace : ' + this.data.ownerPlace
    + ' //ownerUID : ' + this.data.ownerUID
    + ' //namePlace : ' + this.data.namePlace
    + ' //typesPlace : ' + this.data.typesPlace
    + ' //detailPlace : ' + this.data.detailPlace
    + ' //placeAddress : ' + this.data.placeAddress
    + ' //timePlace : ' + this.data.timePlace
    + ' //telephonePlace : ' + this.data.telephonePlace
    + ' //websitePlace : ' + this.data.websitePlace
    + ' //lat : ' + this.data.lat
    + ' //lng : ' + this.data.lng
    + ' //photoPlaceURL : ' + this.data.photoPlaceURL);
    return new Promise((resolve, reject) => {
      this.map.update(this.data).then((res) => {
        alert('แก้ไขข้อมูลสำเร็จ : ' + res);
        this.navCtrl.pop();
        resolve('Success');
      }, err => {
        alert('แก้ไขข้อมูลไม่สำเร็จ : ' + err);
        reject('Unsuccess');
      });
    })
  }








}
