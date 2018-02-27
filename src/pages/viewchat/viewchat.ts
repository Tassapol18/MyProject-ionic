import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-viewchat',
  templateUrl: 'viewchat.html',
})
export class ViewchatPage {
  chatDB: FirebaseListObservable<any[]>;
  chatCheck: FirebaseListObservable<any[]>;
  name: any;
  key: any;
  nameUser: any;
  message: any;
  chatSubscription: any;
  user: any;
  messages: object[] = [];
  check1: string;
  check2: string;
  checkChat: boolean = false;
  keyChat: any;
  userUID: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase, ) {
    this.user = firebase.auth().currentUser;
    this.key = navParams.get('key');
    this.name = navParams.get('name');

    this.nameUser = this.user.displayName;
    this.userUID = this.user.uid;


    this.keyChat = this.user.uid + '_' + this.key;

    this.chatCheck = db.list('/Chat/')
    this.check1 = this.user.uid + '_' + this.key;
    this.check2 = this.key + '_' + this.user.uid;
    this.chatCheck.forEach((res) => {
      res.forEach((resq) => {
        if (resq.$key == this.check1) {
          this.keyChat = this.check1
          this.checkChat = true;
        } else if (resq.$key == this.check2) {
          this.keyChat = this.check2
          this.checkChat = true;
        }
      })
    })

    this.chatSubscription = db.list('/Chat/' + this.keyChat)
      .subscribe((data) => {
        this.messages = data;
      });

    this.chatDB = db.list('/Chat/' + this.keyChat)

  }

  sendMessage() {  //ส่งข้อความ
    return new Promise((resolve, reject) => {
      if (!this.checkChat && this.message != '') {
        this.chatDB.push({
          name: this.nameUser,
          key: this.userUID,
          message: this.message
        }).then((res) => {
          resolve('success');
        }, err => {
          reject('Unsuccess');
        });
        this.message = '';
        this.checkChat = false;
      } else {
        if (this.message != '') {
          this.chatDB.push({
            name: this.nameUser,
            key: this.userUID,
            message: this.message
          }).then((res) => {
            resolve('success');
          }, err => {
            reject('Unsuccess');
          });
          this.message = '';
          this.checkChat = false;
        }

      }

    })
  }

  // ionViewDidLoad() {  //เข้ามา
  //   return new Promise((resolve, reject) => {
  //     if (!this.checkChat) {
  //       this.chatDB.push({
  //         specialMessage: true,
  //         message: this.nameUser + ' กำลังใช้งาน'
  //       }).then((res) => {
  //         resolve('success');
  //       }, err => {
  //         reject('Unsuccess');
  //       });
  //       this.message = '';
  //       this.checkChat = false;
  //     } else {
  //       this.chatDB.push({
  //         specialMessage: true,
  //         message: this.nameUser + ' กำลังใช้งาน'
  //       }).then((res) => {
  //         resolve('success');
  //       }, err => {
  //         reject('Unsuccess');
  //       });
  //       this.message = '';
  //       this.checkChat = false;
  //     }
  //   })
  // }

  // ionViewWillLeave() {  //ออกไป
  //   return new Promise((resolve, reject) => {
  //     if (!this.checkChat) {
  //       this.chatSubscription.unsubscribe();
  //       this.chatDB.push({
  //         specialMessage: true,
  //         message: this.nameUser + ' ออฟไลน์'
  //       }).then((res) => {
  //         resolve('success');
  //       }, err => {
  //         reject('Unsuccess');
  //       });
  //       this.message = '';
  //       this.checkChat = false;
  //     } else {
  //       this.chatSubscription.unsubscribe();
  //       this.chatDB.push({
  //         specialMessage: true,
  //         message: this.nameUser + ' ออฟไลน์'
  //       }).then((res) => {
  //         resolve('success');
  //       }, err => {
  //         reject('Unsuccess');
  //       });
  //       this.message = '';
  //       this.checkChat = false;
  //     }
  //   })

  // }

}
