import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MapPage } from '../map/map';
import { ChatPage } from '../chat/chat';
import { ProfilePage } from '../profile/profile';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import firebase from 'firebase';
import len from 'object-length';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MapPage;
  tab3Root = ChatPage;
  tab4Root = ProfilePage;

  user: FirebaseListObservable<any[]>;
  chat: FirebaseListObservable<any[]>;
  checkReadDB: FirebaseListObservable<any[]>;
  userCur: any;
  data = [];
  keyChat = [];
  n: any;
  n_cnt: any;
  elColor: any;
  tabState: any;


  constructor(public navCtrl: NavController, private platform: Platform, alertCtrl: AlertController, public db: AngularFireDatabase) {
    this.userCur = firebase.auth().currentUser.uid;
    this.n = 0;
    this.elColor = 'Home_Primary';

    this.chat = this.db.list('/Chat');
    this.chat.forEach((res) => {
      this.n = 0;
      for (let i = 0; i < res.length; i++) {
        let spl = res[i].$key.split('_');
        if (this.userCur == spl[0] || this.userCur == spl[1]) {
          this.checkRead(res[i].$key)
        }
      }
    })
  }

  checkRead(keyChat) {
    this.n_cnt = 0;
    this.n = 0;

    this.checkReadDB = this.db.list('/Chat/' + keyChat)
    if (this.tabState) {
      this.checkReadDB.forEach(res => {
        res.forEach(resq => {
          if (resq.key != this.userCur) {
            if (resq.read == false) {
              this.n++;
            }
          }
        })
      })
    }
  }

  changeColor(el) {
    switch (el) {
      case 'Home': this.elColor = 'Home_Primary'; this.tabState = true; console.log(this.elColor); break;
      case 'Map': this.elColor = 'Map_Primary'; this.tabState = true; console.log(this.elColor); break;
      case 'Message': this.elColor = 'Chat_Primary'; this.n = 0; this.tabState = false; console.log(this.elColor); break;
      case 'Profile': this.elColor = 'Profile_Primary'; this.tabState = true; console.log(this.elColor); break;
    }
  }



}
