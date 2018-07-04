import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { StatusBar } from '@ionic-native/status-bar';
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
  topic: any;
  detail: any;
  types: any;
  lat: any;
  lng: any;
  data: any;
  photoPath: any;
  postPhoto: any;
  sendPhotoPostURL: any;
  photoPost: any;
  photoPostURL: any;
  showPhotoUpload: boolean = false;

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
    public statusBar: StatusBar,
    private geolocation: Geolocation,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController) {
    statusBar.backgroundColorByHexString('#e64c05');

    this.photoPost = [];
    this.photoPostURL = [];
  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString('#e64c05');
  }

  getPlace() {
    // let modal = this.modalCtrl.create(MapModalPage);
    // modal.present();

    // modal.onDidDismiss((data) => {
    //   if(data){
    //     this.lat = data.lat
    //     this.lng = data.lng
    //     console.log(this.lat,this.lng);
    //   }      
    // });
    
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
    this.postPhoto = firebase.storage().ref('/Posts/');
    const filename = Math.floor(Date.now() / 1000);
    if (this.photoPostURL.length < 5) {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: "กำลังอัพโหลดรูป..."
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

  //Add data to database
  newPost() {

    let user = firebase.auth().currentUser;
    let timestamp = firebase.database.ServerValue.TIMESTAMP;

    if (this.topic && this.detail && this.types != null) {
      if (this.photoPost && this.photoPostURL == null || this.photoPost && this.photoPostURL == '') {
        this.photoPost = ['-'];
        this.photoPostURL = ['-'];
      }
      this.lat = parseFloat(this.lat);
      this.lng = parseFloat(this.lng);
      this.data = {
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        uid: user.uid,
        topic: this.topic,
        detail: this.detail,
        types: this.types,
        lat: (this.lat) ? this.lat : null,
        lng: (this.lng) ? this.lng : null,
        photoPost: this.photoPost,
        photoPostURL: this.photoPostURL,
        timestamp: timestamp,
      }
      this.uploadPost();
    } else {
      alert('กรุณากรอกข้อมูล * ให้ครบถ้วน');
    }
  }

  //Upload
  uploadPost() {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: "กำลังอัพโหลด รอสักครู่..."
      });
      loading.present();
      this.post = this.db.list('/Posts');
      this.post.push(this.data)
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
