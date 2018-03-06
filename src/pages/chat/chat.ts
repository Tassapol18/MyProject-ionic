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
  chatDB: FirebaseListObservable<any[]>;
  chatCheck: FirebaseListObservable<any[]>;
  checkReadDB: FirebaseListObservable<any[]>;
  chatSubscription: any;
  chatlistSubscription : any;
  userCur: any;
  data = [];
  userChat = [];
  tmpcnt: any;
  read :any;
  loading : any;




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
      console.log("data",this.data);
      
    })
  }

  ionViewWillEnter() {
    console.log("enter");
    this.userChat = []
    this.getnotification()
    
    


  }

  initChat() {
    
  }



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

  getnotification(){
    console.log("notifi");
    // this.loading = true
    // console.log("loading true",this.loading);
    this.chatlistSubscription = this.db.list('/Chat')
    .subscribe((res) => {       

      //console.log("chatlist",this.userChat);
      res.forEach((resp)=>{
        this.userChat.length = 0
        this.userChat = [];
        
        var spl = resp.$key.split('_')
        if(spl[0]== this.userCur.uid||spl[1]== this.userCur.uid){
          //console.log("key",spl);
          //var From  = (spl[0]== this.userCur.uid)? spl[0] : spl[1];
          var To  = (spl[0]== this.userCur.uid)? spl[1] : spl[0];
          //console.log("this key from ",From," send to ",To);
          var unRead = null
          unRead = this.db.list('/Chat/'+resp.$key, {
            query: {
              orderByChild: 'key',
              equalTo: To
            }
          });

          unRead.forEach((readras)=>{
            //console.log("read",this.userChat);
            
            //console.log("from",resp.$key,"get",readras);

            let tmpuserData = {uid:null,name:null,profilePicture:null,notification:null}
            //console.log("tmp",tmpuserData);
            
             /////////////////////////// get To user data
            var tmpuser = this.db.list('/Users', {
              query: {
                orderByChild: 'uid',
                equalTo: To
              }
            });
            tmpuser.forEach((tmpuserres)=>{
              tmpuserres.forEach((tmpdata)=>{
                tmpuserData.name = tmpdata.name
                tmpuserData.profilePicture = tmpdata.profilePicture
                tmpuserData.uid = tmpdata.uid
                //console.log("user getting data",tmpuserData);
                
                
              })
              
            })
            /////////////////////////// END get To user data
             /////////////////////////// get To unread count data
             let cnt=0;
             let unread_cnt = 0;
            readras.forEach((cntread)=>{
              cnt++
              if(cntread.read==false){
                unread_cnt++;
              }
              
              if(cnt==readras.length){
                //console.log("final read ",cnt,"epoch = " ,unread_cnt);
                tmpuserData.notification = unread_cnt
                //console.log("noti getting data",tmpuserData);
                //if(this.userChat.length == 0){
                this.userChat.push(tmpuserData)
                
                //}
                
                
              }
            })
            /////////////////////////// END get To unread count data
            // this.loading = false
            // console.log("loading false",this.loading);
            
          })
          
        }
        
        
        
      })
      
    })


  }


  deleteChat(value) {
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
    });
  }


}
