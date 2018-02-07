import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import  firebase  from 'firebase';


@IonicPage()
@Component({
  selector: 'page-viewchat',
  templateUrl: 'viewchat.html',
})
export class ViewchatPage {

  name: any;
  photo: any;
  key: any;
  message: any;
  chatSubscription: any;
  user: any;
  messages: object[] = [];


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase, ) {
    this.user = firebase.auth().currentUser;
    this.key = navParams.get('key');

    this.name = this.user.displayName;
    this.photo = this.user.photoURL;



    this.chatSubscription = this.db.list('/Chat/' + this.key)
      .subscribe((data) => {
        this.messages = data;
      });
  }

  sendMessage() {  //ส่งข้อความ
    return new Promise((resolve, reject) => {
      this.db.list('/Chat/' + this.key).push({
        name: this.name,
        message: this.message
      }).then((res) => {
        alert('Send : ' + res)
        resolve('success');
        // message is sent
      }, err => {
        alert('Send err : ' + err);
        reject('Unsuccess');
      });
      this.message = '';
    })
  }

  ionViewDidLoad() {  //เข้ามา
    alert('Welcome to chat : ' + this.key)
    alert(this.name)
    this.db.list('/Chat/' + this.key).push({
      specialMessage: true,
      message: this.name + 'has joined the room'
    });
  }

  ionViewWillLeave() {  //ออกไป
    alert(this.name)
    this.chatSubscription.unsubscribe();
    this.db.list('/Chat/' + this.key).push({
      specialMessage: true,
      message: this.name + 'has left the room'
    });
  }

}
