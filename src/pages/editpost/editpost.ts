import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase';
import { StatusBar } from '@ionic-native/status-bar';
import { LoadingController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-editpost',
  templateUrl: 'editpost.html',
})
export class EditpostPage {
  post: any;
  postPhoto: any;
  topic: any;
  detail: any;
  types: any;
  lat: any;
  lng: any;
  key: any;
  data: any;
  photoPath: any;
  photoPost: any;
  photoPostURL: any;
  sendPhotoPostURL: any;
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
    correctOrientation: true
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public statusBar: StatusBar,
    public db: AngularFireDatabase,
    private camera: Camera,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController) {


    this.photoPost = [];
    this.photoPostURL = [];
    this.showPhotoUpload = true;

    this.key = navParams.get('key');
    this.topic = navParams.get('topic');
    this.detail = navParams.get('detail');
    this.types = navParams.get('types');
    this.lat = navParams.get('lat');
    this.lng = navParams.get('lng');
    this.photoPost = navParams.get('photoPost');
    this.photoPostURL = navParams.get('photoPostURL');

    if (this.photoPost && this.photoPostURL == '-') {
      this.photoPost = [];
      this.photoPostURL = [];
    }

  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString('#e64c05');
  }

  getPlace() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true })
      .then((res) => {
        this.lat = res.coords.latitude;
        this.lng = res.coords.longitude;
      }).catch((err) => {
        alert('พบปัญหาในการดึงตำแหน่ง : ' + err)
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
          resolve('ไม่พบปัญหาเกี่ยวกับรูปภาพ');
        }).catch((err) => {
          reject('พบปัญหารูปภาพ : ' + err);
        })
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
        }).catch((err) => {
          reject('พบปัญหาเกี่ยวกับรูปภาพ : ' + err);
        })
    }).then(() => {
      this.upLoadImage();
    }).catch((err) => {
      alert(err)
    })
  }


  //Upload Image
  upLoadImage() {
    this.postPhoto = firebase.storage().ref('/Posts/');
    const filename = Math.floor(Date.now() / 1000);
    if (this.photoPostURL.length < 5) {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: "กำลังอัพโหลดรูป รอสักครู่..."
      });
      loading.present();
      let name = 'Post_' + filename;
      this.photoPost.push(name)
      this.sendPhotoPostURL = this.postPhoto.child(name);
      this.sendPhotoPostURL.putString(this.photoPath, firebase.storage.StringFormat.DATA_URL)
        .then(() => {
          this.postPhoto.child(name).getDownloadURL()
            .then((url) => {
              this.photoPostURL.push(url);
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
    firebase.storage().ref('/Posts/' + this.photoPost[index]).delete()
      .then(() => {
        this.photoPost.splice(index, 1);
        this.photoPostURL.splice(index, 1);
      }).catch(err => {
        alert('พบปัญหา : ' + err)
      });
  }

  //Func Editpost
  editPost() {

    if (this.photoPost && this.photoPostURL == null || this.photoPost && this.photoPostURL == '') {
      this.photoPost = ['-'];
      this.photoPostURL = ['-'];
    }

    this.lat = parseFloat(this.lat)
    this.lng = parseFloat(this.lng)

    if (this.topic && this.detail && this.types != null) {
      this.data = {
        topic: this.topic,
        detail: this.detail,
        types: this.types,
        lat: (this.lat) ? this.lat : null,
        lng: (this.lng) ? this.lng : null,
        photoPost: (this.photoPost) ? this.photoPost : [null],
        photoPostURL: (this.photoPostURL) ? this.photoPostURL : [null],
      }
      this.updateFromEdit();
    } else {
      alert('กรุณากรอกข้อมูล * ให้ครบถ้วน');
    }

  }

  //Update
  updateFromEdit() {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: "กำลังอัพโหลด รอสักครู่..."
      });
      loading.present();
      this.post = this.db.object('/Posts/' + this.key);
      this.post.update(this.data)
        .then(() => {
          loading.dismissAll();
          resolve('ไม่พบปัญหาการอัพโหลด')
        }).catch((err) => {
          loading.dismissAll();
          reject('พบปัญาการอัพโหลด : ' + err)
        })
    }).then((res) => {
      this.navCtrl.pop();
    }).catch((err) => {
      alert(err)
    })
  }
}