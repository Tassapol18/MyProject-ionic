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
  photoPath: any;
  photoPlace: any;
  sendPhotoPlaceURL: any;
  photoPlaceURL: any;
  showPhotoUpload: boolean = false;



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
    correctOrientation: true,
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    private geolocation: Geolocation,
    private camera: Camera) {

    this.photoPlace = [];
    this.photoPlaceURL = [];



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
  }

  resetLatLng() {
    return this.lat = null, this.lng = null;
  }

  //Camera
  takePhoto() {
    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.options)
        .then((myPhoto) => {
          this.photoPath = 'data:image/jpeg;base64,' + myPhoto;
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
          this.photoPath = 'data:image/jpeg;base64,' + myPhoto;
          this.upLoadImage();
          resolve('send picture to upload');
        }, (err) => {
          reject('fail : ' + err);
        });
    })
  }

  //Upload Image
  upLoadImage() {
    alert('รออัพโหลดรูปสักครู่...')
    console.log('sda', this.photoPlaceURL);
    this.mapPhoto = firebase.storage().ref('/Maps/');
    let filename = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
      if (this.photoPlaceURL.length < 5) {
        let name = 'Maps_' + filename;
        this.photoPlace.push(name)
        this.sendPhotoPlaceURL = this.mapPhoto.child(name);
        this.sendPhotoPlaceURL.putString(this.photoPath, firebase.storage.StringFormat.DATA_URL)
          .then(() => {
            alert('อัพโหลดรูปสำเร็จ : ' + this.sendPhotoPlaceURL);
            this.mapPhoto.child(name).getDownloadURL()
              .then((url) => {
                this.photoPlaceURL.push(url)
                this.showPhotoUpload = true;
              }).catch((err) => {
                alert('fail : ' + err)
              });
            resolve('Upload Image Success')
          }).catch((err) => {
            alert('อัพโหลดรูปไม่สำเร็จ : ' + err)
            reject('fail : ' + err)
          });
      } else {
        alert('ไม่สามารถอัพโหลดรูปเพิ่มได้')
      }
    })
  }

  //DeletePhoto
  deletePhotoUpload(index) {
    firebase.storage().ref('/Maps/' + this.photoPlace[index]).delete()
      .then(() => {
        this.photoPlace.splice(index, 1);
        this.photoPlaceURL.splice(index, 1);
      }).catch(err => {
        alert('fail : ' + err)
      });
  }

  newMaps(namePlace, typesPlace, detailPlace, placeAddress, timePlace, telephonePlace, websitePlace) {
    let user = firebase.auth().currentUser;
    let timestamp = firebase.database.ServerValue.TIMESTAMP;

    if(this.photoPlace && this.photoPlaceURL == null || this.photoPlace && this.photoPlaceURL == ''){
      this.photoPlace = ['-'];
      this.photoPlaceURL = ['https://firebasestorage.googleapis.com/v0/b/countrytrip-31ea9.appspot.com/o/noPicture.png?alt=media&token=555747fe-37fe-4f1f-a15a-295d837086d0'];
    }
    
    this.lat = parseFloat(this.lat);
    this.lng = parseFloat(this.lng);

    if (namePlace && typesPlace && detailPlace && this.lat && this.lng != null) {
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
        photoPlace: this.photoPlace,
        photoPlaceURL: this.photoPlaceURL,
        timestamp: timestamp,
      }
      console.log(this.data);

      this.CreateMap();
    } else {
      alert('กรุณากรอกข้อมูล * ให้ครบถ้วน');
    }
  }

  CreateMap() {
    return new Promise((resolve, reject) => {
      this.maps = this.db.list('/Maps');
      this.maps.push(this.data).then(() => {
        alert('เพิ่มสถานที่สำเร็จ')
        this.navCtrl.pop();
        resolve('success');
      }), err => {
        alert('ไม่สามารถเพิ่มสถานที่ได้ ' + err)
        reject('fail');
      }
    })
  }
}