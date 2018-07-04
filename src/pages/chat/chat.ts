import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { ViewchatPage } from '../viewchat/viewchat';
import { StatusBar } from '@ionic-native/status-bar';
import firebase from 'firebase';
import len from 'object-length'
import concat from 'concat-object'

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  user: FirebaseListObservable<any[]>;
  chatDel: FirebaseListObservable<any[]>;
  chatDB: FirebaseListObservable<any[]>;
  checkReadDB: FirebaseListObservable<any[]>;
  userCur: any;
  n: any;
  data = [];
  userChat = [];
  delKey = [];
  // chatCheck: FirebaseListObservable<any[]>;
  // chatSubscription: any;
  // chatlistSubscription: any;
  // tmpcnt: any;
  // read: any;
  // loading: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public statusBar: StatusBar,
    public db: AngularFireDatabase, ) {

    statusBar.backgroundColorByHexString('#33af0d');

    this.userCur = firebase.auth().currentUser;
    this.user = this.db.list('/Users');
    this.n = 0;
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
    this.statusBar.backgroundColorByHexString('#33af0d');
    // console.log("start listen");
    this.initChat()
    /*this.loading = setInterval(function () {
      me.initChat();
  }, 300);*/
  }

  initChat() {
    this.userChat = []
    this.chatDB = this.db.list('/Chat');
    var cnt_userChat = 0;

    this.chatDB.forEach((resp) => {
      resp.forEach((resi) => {

        cnt_userChat++
        let spl = resi.$key.split('_')
        var tmparr = [];

        if (this.userCur.uid == spl[0] || this.userCur.uid == spl[1]) {
          let To = (this.userCur.uid == spl[0]) ? spl[1] : spl[0];
          this.delKey.push(resi.$key)
          this.n = 0;
          this.checkReadDB = this.db.list('/Chat/' + resi.$key, {
            query: {
              orderByChild: 'key',
              equalTo: To
            }
          });
          this.userChat = [];

          this.checkReadDB.forEach(res => {
            let cnt = 0;

            res.forEach(resq => {
              cnt++;

              if (resq.key != this.userCur) {
                if (resq.read == false) {
                  this.n++;
                }
              }

              if (cnt == res.length) {
                var userR = this.db.list(`/Users/` + To);
                userR.forEach((UserSnapshot) => {
                  var arr = {}

                  for (var o = 0; o < len(UserSnapshot); o++) {
                    arr[UserSnapshot[o].$key] = UserSnapshot[o].$value
                  }
                  arr['notification'] = this.n

                  if (this.checkExit(To)) {
                    for (var gg in this.userChat) {
                      if (this.userChat[gg].uid == To) {
                        this.userChat[gg].notification = this.n
                        this.n = 0
                        break;
                      }
                    }
                  } else {
                    let tmpLkey = this.userCur.uid + '_' + To;
                    let tmpRkey = To + '_' + this.userCur.uid;
                    if (this.checkKey(tmpLkey)) {
                      arr['key'] = tmpLkey
                    }
                    if (this.checkKey(tmpRkey)) {
                      arr['key'] = tmpRkey
                    }
                    this.userChat.push(arr)
                    this.n = 0
                  }
                });
              }
            })
          })
        }
      })
    })
  }


  checkExit(ch) {
    for (var i in this.userChat) {
      if (this.userChat[i].uid == ch) {
        return true
      }
    }
    return false
  }

  checkKey(ch) {
    for (var i in this.delKey) {
      if (this.delKey[i] == ch) {
        return true
      }
    }
    return false
  }

  deleteChat(value) {
    this.chatDel = this.db.list('/Chat/' + value.key);
    let alert = this.alertCtrl.create({
      title: 'คุณต้องการลบข้อความนี้หรือไม่',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
        },
        {
          text: 'ฉันต้องการลบ',
          handler: () => {
            this.chatDel.remove();
          }
        }
      ]
    });
    alert.present();
  }


  goToChat(user) {
    this.navCtrl.push(ViewchatPage, {
      'key': user.uid,
      'name': user.name
    });
  }


  // ionViewWillLeave() {
  //   console.log("stop listen");
  //   clearInterval(this.loading);

  // }

  // getUserdata(key) {
  //   let cc
  //   const UserRef: firebase.database.Reference = firebase.database().ref(`/Users/` + key);
  //   UserRef.on('value', UserSnapshot => {
  //     //console.log(UserSnapshot.val()  );
  //     cc = UserSnapshot.val()
  //   });
  //   return cc
  // }



  // checkUser(val) {
  //   this.user = this.db.list('/Users');
  //   this.user.forEach((res) => {
  //     for (let i = 0; i < res.length; i++) {
  //       if (this.userCur.uid != res[i].$key) {
  //         let temp = {
  //           name: res[i].name,
  //           profilePicture: res[i].profilePicture,
  //           uid: res[i].uid,
  //         }
  //         this.checkChat(temp, val)
  //       }
  //     }
  //   })
  // }

  // checkChat(userChat, keyChat) {
  //   this.userChat = [];
  //   var vm = this
  //   var tmpcnt= -1;
  //   if (this.userCur.uid + '_' + userChat.uid == keyChat || userChat.uid + '_' + this.userCur.uid == keyChat) {
  //     var checkLast = firebase.database().ref('/Chat/' + keyChat)
  //     checkLast.limitToLast(1).on('child_added', function (res) {
  //       var lastChat = res.val();
  //       console.log("fucking keychat",keyChat);

  //       userChat.lastChat = lastChat;
  //       userChat.key = keyChat;
  //       userChat.notification = vm.checkRead(keyChat);
  //     });
  //     this.userChat.push(userChat);


  //   }
  //   console.log("datato send",this.userChat);
  // }

  // getnotification() {
  //   console.log("notifi");
  //   // this.loading = true
  //   // console.log("loading true",this.loading);
  //   this.chatlistSubscription = this.db.list('/Chat')
  //     .subscribe((res) => {

  //       //console.log("chatlist",this.userChat);

  //       for (let a = 0; a < res.length; a++) {
  //         this.userChat.length = 0
  //         this.userChat = [];

  //         var spl = res[a].$key.split('_')
  //         if (spl[0] == this.userCur.uid || spl[1] == this.userCur.uid) {
  //           //console.log("key",spl);
  //           //var From  = (spl[0]== this.userCur.uid)? spl[0] : spl[1];
  //           var To = (spl[0] == this.userCur.uid) ? spl[1] : spl[0];
  //           //console.log("this key from ",From," send to ",To);
  //           var unRead = null
  //           unRead = this.db.list('/Chat/' + res[a].$key, {
  //             query: {
  //               orderByChild: 'key',
  //               equalTo: To
  //             }
  //           });

  //           for (let i = 0; i < unRead.length; i++) {
  //             //console.log("read",this.userChat);
  //             //console.log("from",resp.$key,"get",readras);
  //             let tmpuserData = { uid: null, name: null, profilePicture: null, notification: null }
  //             //console.log("tmp",tmpuserData);

  //             /////////////////////////// get To user data
  //             var tmpuser = this.db.list('/Users', {
  //               query: {
  //                 orderByChild: 'uid',
  //                 equalTo: To
  //               }
  //             });

  //             tmpuser.forEach((tmpuserres) => {
  //               tmpuserres.forEach((tmpdata) => {
  //                 tmpuserData.name = tmpdata.name
  //                 tmpuserData.profilePicture = tmpdata.profilePicture
  //                 tmpuserData.uid = tmpdata.uid
  //                 //console.log("user getting data",tmpuserData);
  //               })
  //             })
  //             /////////////////////////// END get To user data

  //             /////////////////////////// get To unread count data
  //             let cnt = 0;
  //             let unread_cnt = 0;
  //             for (let j = 0; j < unRead[i].length; j++) {

  //               cnt++
  //               if (unRead[i][j].read == false) {
  //                 unread_cnt++;
  //               }

  //               if (cnt == unRead[i][j].length) {
  //                 //console.log("final read ",cnt,"epoch = " ,unread_cnt);
  //                 tmpuserData.notification = unread_cnt
  //                 //console.log("noti getting data",tmpuserData);
  //                 //if(this.userChat.length == 0){
  //                 this.userChat.push(tmpuserData)
  //                 //}
  //               }
  //             }
  //             /////////////////////////// END get To unread count data
  //             // this.loading = false
  //             // console.log("loading false",this.loading);
  //           }
  //         }
  //       }
  //     })
  // }
}
