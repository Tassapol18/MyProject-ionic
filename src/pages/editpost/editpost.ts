import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
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

  name: any;
  email: any;
  topic: any;
  detail: any;
  types: any;
  lat: any;
  lng: any;
  photo: any;
  photoURL: any;
  key: any;
  myPhoto: any;
  data: any;
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

    this.name = navParams.get('name');
    this.email = navParams.get('email');
    this.topic = navParams.get('topic');
    this.detail = navParams.get('detail');
    this.types = navParams.get('types');
    this.lat = navParams.get('lat');
    this.lng = navParams.get('lng');
    this.photo = navParams.get('photo');
    this.photoURL = navParams.get('photoURL');
    this.key = navParams.get('key');

    

    if(this.photo != null){
      this.showPhotoUpload = true;
    }else{
      this.showPhotoUpload = false;
    }



  }

  addLatLng() {
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
    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => { });
    // return this.lat, this.lng;
  }
  resetLatLng(){
   return this.lat = null, this.lng = null;
  }

  //Camera
  /*
photoURL = nameImg(Storage)
photo = myPhotoURL(base to database)
 */
  takePhoto() {
    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.options)
        .then((myPhoto) => {
          this.photo = 'data:image/jpeg;base64,' + myPhoto;
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
          this.photo = 'data:image/jpeg;base64,' + myPhoto;
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
      this.photoURL = 'Post_' + filename;
      const imageRef = this.postPhoto.child(this.photoURL);
      imageRef.putString(this.photo, firebase.storage.StringFormat.DATA_URL)
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
    alert('Delete Photo now : ' + this.photoURL)
    firebase.storage().ref('/Posts/' + this.photoURL).delete();
    this.photo = null;
    this.photoURL = null;
    this.showPhotoUpload = false;
  }


  //Func Editpost
  editPost(topic, detail, types) {
    alert('This function newPost => '
      + ' Topic : ' + topic
      + ' Detail : ' + detail
      + ' types : ' + types);
    let user = firebase.auth().currentUser;

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
      photo: (this.photo) ? this.photo : null,
      imageURL: (this.photoURL) ? this.photoURL : null,
    }
    alert('use func UpdateFromEdit')
    this.updateFromEdit();
  }

  //Update
  updateFromEdit() {
    alert('Func updateEdit');
    this.post = this.db.object('/Posts/' + this.key);
    alert('data : ' + this.data);
    return new Promise((resolve, reject) => {
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
  // alert('Use func uploadPost');
  // this.uploadPost();
  // alert('This func editPost : Topic : ' + topic + ' Detail : ' + detail + ' types : ' + types);
  // this.post = this.db.object('/Posts/' + this.key);
  // alert('Address ' + this.post);
  // alert('key ' + this.key);
  // this.postPhoto = firebase.storage().ref('/Posts');
  // let user = firebase.auth().currentUser;

  // if (topic && detail && types != null) {
  //   if (this.lat && this.lng && this.photo == null) {
  //     alert('If 1')
  //     this.data = {
  //       topic: topic,
  //       detail: detail,
  //       types: types,
  //     }

  //   } else if (this.photo == null) {
  //     alert('If 2')
  //     this.data = {
  //       topic: topic,
  //       detail: detail,
  //       types: types,
  //       lat: this.lat,
  //       lng: this.lng,
  //     }

  //   } else if (this.lat && this.lng == null) {
  //     alert('If 3 add new')
  //     //Upload image
  //     let nameImg = this.photoURL;
  //     let imageRef = this.postPhoto.child(nameImg);
  //     imageRef.putString(this.photo, firebase.storage.StringFormat.DATA_URL).then(() => {
  //       alert('Upload Success : ' + imageRef)
  //     }).catch((err) => {
  //       alert('อัพโหลดรูปภาพมีปัญหา : ' + err)
  //     });
  //     this.data = {
  //       topic: topic,
  //       detail: detail,
  //       types: types,
  //       photo: this.photo,
  //       imageURL: nameImg
  //     }

  //   } else {
  //     alert('If 4')
  //     //Upload image
  //     let nameImg = this.photoURL;
  //     let imageRef = this.postPhoto.child(nameImg);
  //     imageRef.putString(this.photo, firebase.storage.StringFormat.DATA_URL).then(() => {
  //       alert('Upload Success  : ' + imageRef)
  //     }).catch((err) => {
  //       alert('อัพโหลดรูปภาพมีปัญหา : ' + err)
  //     });
  //     this.data = {
  //       topic: topic,
  //       detail: detail,
  //       types: types,
  //       lat: this.lat,
  //       lng: this.lng,
  //       photo: this.photo,
  //       imageURL: nameImg,
  //     }
  //   }
  //   alert('gotoUpdateFromEdit')
  //   this.updateFromEdit();
  // } else {
  //   alert("กรุณากรอกข้อมูล * ให้ครบถ้วน");
  // }
  // }