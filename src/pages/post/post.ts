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
  myPhoto: any;
  myPhotoURL: any;
  lat: any;
  lng: any;
  data: any;
  nameImg: any;
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
    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => { });
    // return this.lat, this.lng;
  }

  //Camera
  takePhoto() {
    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.options)
        .then((myPhoto) => {
          this.myPhotoURL = 'data:image/jpeg;base64,' + myPhoto;
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
          this.myPhotoURL = 'data:image/jpeg;base64,' + myPhoto;
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
    this.postPhoto = firebase.storage().ref('/Posts');
    const filename = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
      this.nameImg = 'Post_' + filename;
      const imageRef = this.postPhoto.child(this.nameImg);
      imageRef.putString(this.myPhotoURL, firebase.storage.StringFormat.DATA_URL)
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
    alert('Delete Photo now : ' + this.nameImg)
    firebase.storage().ref('/Posts/' + this.nameImg).delete();
    this.myPhotoURL = null;
    this.showPhotoUpload = false;
  }

  //Add data to database
  newPost(topic, detail, types) {
    alert('This function newPost => '
      + ' Topic : ' + topic
      + ' Detail : ' + detail
      + ' types : ' + types);

    let user = firebase.auth().currentUser;
    let timestamp = firebase.database.ServerValue.TIMESTAMP;
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
      photo: (this.myPhotoURL) ? this.myPhotoURL : null,
      imageURL: (this.nameImg) ? this.nameImg : null,
      timestamp: timestamp,
    }
    alert('Use func uploadPost');
    this.uploadPost();
  }

  uploadPost() {
    alert('Func uploadPost')
    this.post = this.db.list('/Posts');
    return new Promise((resolve, reject) => {
      this.post.push(this.data).then((res) => {
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
