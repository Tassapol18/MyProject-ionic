import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { MapPage } from '../map/map';
import { ChatPage } from '../chat/chat';
import { ProfilePage } from '../profile/profile';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import firebase from 'firebase';

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


  constructor(public db: AngularFireDatabase) {
    this.userCur = firebase.auth().currentUser.uid;
    this.n = 0;

    this.chat = this.db.list('/Chat');
    this.chat.forEach((res) => {
      this.n = 0;      
      for (let i = 0; i < res.length; i++) {
        let spl = res[i].$key.split('_');
        //console.log("split",spl);
        if(this.userCur == spl[0] || this.userCur == spl[1]){
          this.checkRead(res[i].$key)
        }
        
      }
    })



  }



  checkRead(keyChat) {
    this.checkReadDB = this.db.list('/Chat/' + keyChat)
    this.checkReadDB.forEach(res => {
      let cnt = 0;
      res.forEach(resq => {
        //console.log("gfg", JSON.stringify(resq));
        cnt++;
        //console.log("compare", resq.key, "with", this.userCur);

        if (resq.key != this.userCur) {
          //console.log("get");

          if (resq.read == false) {
            //console.log("not readed");

            this.n += 1;
          }
        }
        if (cnt == res.length) {
          //console.log('count',this.n);
        }
      })
    })

  }
}
