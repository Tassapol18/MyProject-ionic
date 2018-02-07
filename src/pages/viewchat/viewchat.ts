import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';


@IonicPage()
@Component({
  selector: 'page-viewchat',
  templateUrl: 'viewchat.html',
})
export class ViewchatPage {
  // chatMessage: FirebaseListObservable<any[]>;
  name: any;
  photo: any;
  key: any;
  // message: any;
  // chatSubscription: any;
  // user: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase, ) {

    this.name = navParams.get('name');
    this.photo = navParams.get('photo');
    this.key = navParams.get('key');

    // this.user = firebase.auth().currentUser;
  }
  // sendMessage() {
  //   return new Promise((resolve, reject) => {
  //     this.db.list('/Chat/' + this.user.uid + this.key).push({
  //       name: this.name ? this.name : this.user.displayName,
  //       message: this.message
  //     }).then((res) => {
  //       alert('Send : ' + res)
  //       resolve('success');
  //       // message is sent
  //     }, err => {
  //       alert('Send err : ' + err);
  //       reject('Unsuccess');
  //     });
  //     this.message = '';
  //   })
  // }

  // ionViewDidLoad() {  //เข้ามา
  //   this.db.list('/Chat/' + this.user.uid + this.key).push({
  //     specialMessage: true,
  //     message: this.name + 'has joined the room'
  //   });
  // }

  // ionViewWillLeave() {  //ออกไป
  //   this.chatSubscription.unsubscribe();
  //   this.db.list('/Chat/' + this.user.uid + this.key).push({
  //     specialMessage: true,
  //     message: `${this.name} has left the room`
  //   });
  // }

}
