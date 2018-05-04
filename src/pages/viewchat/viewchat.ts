import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-viewchat',
  templateUrl: 'viewchat.html',
})
export class ViewchatPage {
  @ViewChild('content') content: any;
  chatDB: FirebaseListObservable<any[]>;
  chatCheck: FirebaseListObservable<any[]>;
  checkReadDB: FirebaseListObservable<any[]>;
  name: any;
  key: any;
  nameUser: any;
  message: any;
  chatSubscription: any;
  user: any;
  messages = [];
  check1: string;
  check2: string;
  checkChat: boolean = false;
  keyChat: any;
  userUID: any;
  task: any;
  innerstate: any;
  loading: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase, ) {
    this.user = firebase.auth().currentUser;
    this.key = navParams.get('key');
    this.name = navParams.get('name');


    this.nameUser = this.user.displayName;
    this.userUID = this.user.uid;





    this.chatCheck = db.list('/Chat/')
    this.check1 = this.userUID + '_' + this.key;
    this.keyChat = this.check1
    this.check2 = this.key + '_' + this.userUID;
    //console.log("check1",this.check1);
    //console.log("check2",this.check2);

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

  ionViewWillEnter() {  //เข้ามา
    this.innerstate = true;
    console.log("USER ONLINE", this.innerstate);
    
    this.updateChatRead()
    
    




    // return new Promise((resolve, reject) => {
    //   if (!this.checkChat) {
    //     this.chatDB.push({
    //       specialMessage: true,
    //       message: this.nameUser + ' กำลังใช้งาน'
    //     }).then((res) => {
    //       resolve('success');
    //     }, err => {
    //       reject('Unsuccess');
    //     });
    //     this.message = '';
    //     this.checkChat = false;
    //   } else {
    //     this.chatDB.push({
    //       specialMessage: true,
    //       message: this.nameUser + ' กำลังใช้งาน'
    //     }).then((res) => {
    //       resolve('success');
    //     }, err => {
    //       reject('Unsuccess');
    //     });
    //     this.message = '';
    //     this.checkChat = false;
    //   }
    // })
  }

  updateChatRead() {
    var updateState = this.db.list('/Chat/' + this.keyChat)
    updateState.forEach((res) => {
      res.forEach((resq => {
        if (resq.key != this.userUID) {
          //console.log("updatefor",this.keyChat+"/"+resq.$key);
          if (this.innerstate) {
            //console.log("update state chat",this.keyChat,"/",resq.$key);

            this.updateChatData(this.keyChat, resq.$key)
          }
        }
      }))
    })
    this.content.scrollToBottom(100);//300ms animation speed
  }

  updateChatData(key, user) {


    let path = `Chat/${key}/${user}`;
    let data = {
      read: true
    }

    this.db.object(path).update(data)
      .catch(error => console.log(error));

  }

  sendMessage() {  //ส่งข้อความ
    console.log("thisuser", this.userUID, "Send to ", this.key, "On", this.keyChat);
    return new Promise((resolve, reject) => {
      if (!this.checkChat && this.message != '') {
        this.chatDB.push({
          name: this.nameUser,
          key: this.userUID,
          message: this.message,
          read: false
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
            message: this.message,
            read: false
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




  

  ionViewWillLeave() {  //ออกไป
    this.innerstate = false;
    //clearInterval(this.loading);
    // return new Promise((resolve, reject) => {
    //   if (!this.checkChat) {
    //     this.chatSubscription.unsubscribe();
    //     this.chatDB.push({
    //       specialMessage: true,
    //       message: this.nameUser + ' ออฟไลน์'
    //     }).then((res) => {
    //       resolve('success');
    //     }, err => {
    //       reject('Unsuccess');
    //     });
    //     this.message = '';
    //     this.checkChat = false;
    //   } else {
    //     this.chatSubscription.unsubscribe();
    //     this.chatDB.push({
    //       specialMessage: true,
    //       message: this.nameUser + ' ออฟไลน์'
    //     }).then((res) => {
    //       resolve('success');
    //     }, err => {
    //       reject('Unsuccess');
    //     });
    //     this.message = '';
    //     this.checkChat = false;
    //   }
    // })

  }

}
