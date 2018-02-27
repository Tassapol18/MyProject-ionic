import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  lat: any;
  lng: any;
  data: any;
  photoPath: any;  //Path ของรูป
  photoPost: any;   //ชื่อรูป
  sendPhotoPostURL: any; //ส่งรูปไปยัง Storage
  photoPostURL: any;  //URL รูป
  showPhotoUpload: boolean;

  /*  CameraOptions
    quality: 100, -> คุณภาพ
    destinationType: Camera.DestinationType.FILE_URI, -> กำหนดประเภทข้อมูลที่ต้องการคืนค่ากลับมา
    sourceType: pic_source, -> การใช้รูปภาพ
    allowEdit: false, -> การปรับแก้ไขหลังถ่ายรูป (ไม่จำเป็น)
    encodingType: Camera.EncodingType.JPEG, -> กำหนดรูปแบบของรูป
    targetWidth: 200, -> ขนาดความกว้าง
    targetHeight: 200, -> ขนาดความสูง
    mediaType: Camera.MediaType.PICTURE, -> กำหนดประเภทของไฟล์ที่ต้องการให้สามารถเลือกได้กรณีเลือกรูปจากอัลบั้ม
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false, -> กำหนดให้หลังจากถ่ายรูปมาแล้วให้ทำการบันทึกไว้ในอัลบั้มรูปด้วยหรือไม่
    correctOrientation:true -> กำหนดให้จัดการการจับภาพให้ถูกต้องตามการหมุนของเครื่องขณะใช้งาน
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

  //Add data to database
  newPost(topic, detail, types) {
    let user = firebase.auth().currentUser;
    let timestamp = firebase.database.ServerValue.TIMESTAMP;
    // alert(this.photoPost + ' &TH& ' + this.photoPostURL)
    if (topic && detail && types != null) {
      this.data = {
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        uid: user.uid,
        topic: topic,
        detail: detail,
        types: types,
        lat: (this.lat) ? this.lat : null,
        lng: (this.lng) ? this.lng : null,
        photoPost: (this.photoPost) ? this.photoPost : null,
        photoPostURL: (this.photoPostURL) ? this.photoPostURL : null,
        timestamp: timestamp,
      }
      this.uploadPost();
    } else {
      alert('กรุณากรอกข้อมูล * ให้ครบถ้วน');
    }
  }

  //Upload
  uploadPost() {
    alert('กำลังสร้างกระดานข่าวสาร รอสักครู่...')
    this.post = this.db.list('/Posts');
    return new Promise((resolve, reject) => {
      this.post.push(this.data).then((res) => {
        alert('สร้างกระดานข่าวสารสำเร็จ');
        this.navCtrl.pop();
        resolve('Success');
      }, err => {
        alert('สร้างกระดานข่าวสารไม่สำเร็จ');
        reject('fail');
      });
    })
  }
}
