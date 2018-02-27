import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase';


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
  sendPhotoPostURL: any;
  photoPostURL: any;
  showPhotoUpload: boolean = false;

  /*
photoURL = nameImg(Storage)
photo = myPhotoURL(base to database)
  */


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
    this.topic = navParams.get('topic');
    this.detail = navParams.get('detail');
    this.types = navParams.get('types');
    this.lat = navParams.get('lat');
    this.lng = navParams.get('lng');
    this.photoPost = navParams.get('photoPost');
    this.photoPostURL = navParams.get('photoPostURL');

    if (this.photoPost != null) {
      this.showPhotoUpload = true;
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
      return this.lat, this.lng;
    })
  }

  resetPlace() {
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
    this.postPhoto = firebase.storage().ref('/Posts/');
    const filename = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
      this.photoPost = 'Post_' + filename;
      this.sendPhotoPostURL = this.postPhoto.child(this.photoPost);
      this.sendPhotoPostURL.putString(this.photoPath, firebase.storage.StringFormat.DATA_URL)
        .then(() => {
          alert('อัพโหลดรูปสำเร็จ : ' + this.sendPhotoPostURL);
          this.postPhoto.child(this.photoPost).getDownloadURL()
            .then((url) => {
              this.photoPostURL = url;
              this.showPhotoUpload = true;
            }).catch((err) => {
              alert('fail : ' + err)
            });
          resolve('Upload Image Success')
        }).catch((err) => {
          alert('อัพโหลดรูปไม่สำเร็จ : ' + err)
          reject('fail : ' + err)
        });
    })
  }

  //DeletePhoto
  deletePhotoUpload() {
    // alert('คุณกำลังจะลบรูป : ' + this.sendPhotoPostURL)
    firebase.storage().ref('/Posts/' + this.photoPost).delete()
    .then(() => {
      this.photoPost = null;
      this.photoPostURL = null;
      this.showPhotoUpload = false;
    }).catch(err => {
      alert('fail : ' + err)
    });
  }

  //Func Editpost
  editPost(topic, detail, types) {

    this.lat = parseFloat(this.lat);
    this.lng = parseFloat(this.lng);

    if (topic && detail && types != null) {
      this.data = {
        topic: topic,
        detail: detail,
        types: types,
        lat: (this.lat) ? this.lat : null,
        lng: (this.lng) ? this.lng : null,
        photoPost: (this.photoPost) ? this.photoPost : null,
        photoPostURL: (this.photoPostURL) ? this.photoPostURL : null,
      }
      this.updateFromEdit();
    } else {
      alert('กรุณากรอกข้อมูล * ให้ครบถ้วน');
    }

  }

  //Update
  updateFromEdit() {
    alert('กำลังอัพเดทกระดานข่าว รอสักครู่...');
    return new Promise((resolve, reject) => {
      this.post = this.db.object('/Posts/' + this.key);
      this.post.update(this.data).then((res) => {
        alert('แก้ไขข้อมูลสำเร็จ : ' + res);
        this.navCtrl.pop();
        resolve('Success');
      }).catch((err) => {
        alert('แก้ไขข้อมูลไม่สำเร็จ : ' + err);
        reject('Unsuccess');
      })
    })
  }
}