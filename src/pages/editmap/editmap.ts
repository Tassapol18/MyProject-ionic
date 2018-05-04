import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase';
import { LoadingController } from 'ionic-angular';

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
  photoPath: any;
  photoPlace: any;
  sendPhotoPlaceURL: any;
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
    public statusBar: StatusBar,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController) {

    statusBar.backgroundColorByHexString('#750581');
    this.photoPlace = [];
    this.photoPlaceURL = [];
    this.showPhotoUpload = true;

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

    if (this.photoPlace == '-') {
      this.photoPlace = [];
      this.photoPlaceURL = [];
    }

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
          reject('พบปัญหารูปภาพ : ' + err);
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
          reject('พบปัญหารูปภาพ : ' + err);
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
      alert('ไม่สามารถอัพรูปเพิ่มได้')
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

  editMap() {
    let user = firebase.auth().currentUser;

    if (this.photoPlace && this.photoPlaceURL == null || this.photoPlace && this.photoPlaceURL == '') {
      this.photoPlace = ['-'];
      this.photoPlaceURL = ['https://firebasestorage.googleapis.com/v0/b/countrytrip-31ea9.appspot.com/o/noPicture.png?alt=media&token=555747fe-37fe-4f1f-a15a-295d837086d0'];
    }

    this.lat = parseFloat(this.lat);
    this.lng = parseFloat(this.lng);

    if (this.namePlace && this.typesPlace && this.detailPlace != null) {
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
        lat: this.lat,
        lng: this.lng,
        photoPlace: this.photoPlace,
        photoPlaceURL: this.photoPlaceURL,
      }
      this.updateFromEdit();
    } else {
      alert('กรุณากรอกข้อมูล * ให้ครบถ้วน');
    }
  }

  //Ppdate
  updateFromEdit() {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: "กำลังอัพโหลด รอสักครู่..."
      });
      loading.present();
      this.map = this.db.object('/Maps/' + this.key);
      this.map.update(this.data)
        .then(() => {
          loading.dismissAll();
          resolve('ไม่พบปัญหาการอัพโหลด')
        }).catch((err) => {
          loading.dismissAll();
          reject('พบปัญาการอัพโหลด : ' + err)
        });
    }).then((res) => {
      this.navCtrl.pop();
    }).catch((err) => {
      alert(err)
    })
  }








}
