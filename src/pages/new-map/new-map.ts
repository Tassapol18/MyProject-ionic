import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import firebase from 'firebase';
import { LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-new-map',
  templateUrl: 'new-map.html',
})
export class NewMapPage {

  maps: FirebaseListObservable<any[]>;
  namePlace: any;
  typesPlace: any;
  detailPlace: any;
  placeAddress: any;
  timePlace: any;
  telephonePlace: any;
  websitePlace: any;
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
    public statusBar: StatusBar,
    private geolocation: Geolocation,
    private camera: Camera,
    public loadingCtrl: LoadingController) {
    statusBar.backgroundColorByHexString('#750581');

    this.photoPlace = [];
    this.photoPlaceURL = [];
  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString('#750581');
  }

  getPlace() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true })
      .then((res) => {
        this.lat = res.coords.latitude;
        this.lng = res.coords.longitude;
      }).catch((err) => {
        alert('พบปัญหาในการดึงตำแหน่ง : ' + err)
      });
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
          resolve('ไม่พบปัญหาเกี่ยวกับรูปภาพ');
        }, (err) => {
          reject('พบปัญหาเกี่ยวกับรูปภาพ : ' + err);
        });
    }).then(() => {
      this.upLoadImage();
    }).catch((err) => {
      alert(err)
    })
  }

  selectPhoto() {
    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.optionsSelect)
        .then((myPhoto) => {
          this.photoPath = 'data:image/jpeg;base64,' + myPhoto;
          resolve('ไม่พบปัญหาเกี่ยวกับรูปภาพ');
        }, (err) => {
          reject('พบปัญหาเกี่ยวกับรูปภาพ : ' + err);
        });
    }).then(() => {
      this.upLoadImage();
    }).catch((err) => {
      alert(err)
    })
  }

  //Upload Image
  upLoadImage() {
    this.mapPhoto = firebase.storage().ref('/Maps/');
    let filename = Math.floor(Date.now() / 1000);
    if (this.photoPlaceURL.length < 5) {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: "กำลังอัพโหลดรูป..."
      });
      loading.present();
      let name = 'Maps_' + filename;
      this.photoPlace.push(name)
      this.sendPhotoPlaceURL = this.mapPhoto.child(name);
      this.sendPhotoPlaceURL.putString(this.photoPath, firebase.storage.StringFormat.DATA_URL)
        .then(() => {
          this.mapPhoto.child(name).getDownloadURL()
            .then((url) => {
              this.photoPlaceURL.push(url)
              this.showPhotoUpload = true;
            }).catch((err) => {
              alert('พบปัญหาการอัพโหลด : ' + err)
              loading.dismissAll();
            });
          loading.dismissAll();
        }).catch((err) => {
          alert('อัพโหลดรูปไม่สำเร็จ : ' + err)
          loading.dismissAll();
        });
    } else {
      alert('ไม่สามารถอัพโหลดรูปเพิ่มได้')
    }
  }

  //DeletePhoto
  deletePhotoUpload(index) {
    firebase.storage().ref('/Maps/' + this.photoPlace[index]).delete()
      .then(() => {
        this.photoPlace.splice(index, 1);
        this.photoPlaceURL.splice(index, 1);
      }).catch(err => {
        alert('พบปัญหา : ' + err)
      });
  }

  newMaps() {
    let user = firebase.auth().currentUser;
    let timestamp = firebase.database.ServerValue.TIMESTAMP;

    if (this.namePlace && this.typesPlace && this.detailPlace && this.lat && this.lng != null) {
      if (this.photoPlace && this.photoPlaceURL == null || this.photoPlace && this.photoPlaceURL == '') {
        this.photoPlace = ['-'];
        this.photoPlaceURL = ['https://firebasestorage.googleapis.com/v0/b/countrytrip-31ea9.appspot.com/o/noPicture.png?alt=media&token=555747fe-37fe-4f1f-a15a-295d837086d0'];
      }
      let _lat = parseFloat(this.lat);
      let _lng = parseFloat(this.lng);

      this.data = {
        ownerPlace: user.displayName,
        ownerUID: user.uid,
        namePlace: this.namePlace,
        typesPlace: this.typesPlace,
        detailPlace: this.detailPlace,
        placeAddress: (this.placeAddress) ? this.placeAddress : '-',
        timePlace: (this.timePlace) ? this.timePlace : '-',
        telephonePlace: (this.telephonePlace) ? this.telephonePlace : '-',
        websitePlace: (this.websitePlace) ? this.websitePlace : '-',
        lat: _lat,
        lng: _lng,
        photoPlace: this.photoPlace,
        photoPlaceURL: this.photoPlaceURL,
        timestamp: timestamp,
      }
      this.CreateMap();
    } else {
      alert('กรุณากรอกข้อมูล * ให้ครบถ้วน');
    }
  }

  CreateMap() {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: "กำลังอัพโหลด รอสักครู่..."
      });
      loading.present();
      this.maps = this.db.list('/Maps');
      this.maps.push(this.data)
        .then(() => {
          loading.dismissAll();
          resolve('ไม่พบปัญหาการอัพโหลด')
        }), err => {
          loading.dismissAll();
          reject('พบปัญาการอัพโหลด : ' + err)
        }
    }).then((res) => {
      this.navCtrl.pop();
    }).catch((err) => {
      alert(err)
    })
  }
}