import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { ViewchatPage } from '../viewchat/viewchat';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  user: FirebaseListObservable<any[]>;
  chat: FirebaseListObservable<any[]>;
  userCur: any;
  data = [];
  userChat = [];



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    private alertCtrl: AlertController) {
    this.userCur = firebase.auth().currentUser;

    this.user = this.db.list('/Users');
    this.user.forEach((res) => {
      for (let i = 0; i < res.length; i++) {
        if (this.userCur.uid != res[i].$key) {
          let temp = {
            name: res[i].name,
            profilePicture: res[i].profilePicture,
            uid: res[i].uid
          }
          this.data.push(temp);
        }
      }
    })
  }

  ionViewWillEnter() {
    this.initChat();
  }

  initChat() {
    this.userChat = [];
    this.chat = this.db.list('/Chat');
    this.chat.forEach((res) => {
      for (let i = 0; i < res.length; i++) {
        this.checkUser(res[i].$key);
      }
    })
  }



  checkUser(val) {
    this.user = this.db.list('/Users');
    this.user.forEach((res) => {
      for (let i = 0; i < res.length; i++) {
        if (this.userCur.uid != res[i].$key) {
          let temp = {
            name: res[i].name,
            profilePicture: res[i].profilePicture,
            uid: res[i].uid,
          }
          this.checkChat(temp, val)
        }
      }
    })
  }

  checkChat(userChat, keyChat) {
    if (this.userCur.uid + '_' + userChat.uid == keyChat || userChat.uid + '_' + this.userCur.uid == keyChat) {
      var checkLast = firebase.database().ref('/Chat/' + keyChat)
      checkLast.limitToLast(1).on('child_added', function (res) {
        var lastChat = res.val();
        userChat.lastChat = lastChat;
        userChat.key = keyChat;
      });
      this.userChat.push(userChat);
    }
  }

  deleteCheckin(value) {
    this.chat = this.db.list('/Chat/' + value.key);
    let alert = this.alertCtrl.create({
      title: 'คุณต้องการลบกระดานข่าวของคุณหรือไม่',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
        },
        {
          text: 'ฉันต้องการลบ',
          handler: () => {
            this.chat.remove();
          }
        }
      ]
    });
    alert.present();
  }


  goToChat(user) {
    this.navCtrl.push(ViewchatPage, {
      'key': user.uid,
      'name': user.name,
    });
  }


}
