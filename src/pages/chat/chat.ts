import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  userCur; any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase) {

    this.user = db.list('/Users', {
      query: {
        orderByChild: 'uid',
      }
    });

    this.userCur = firebase.auth().currentUser;

  }


  goToChat(user) {
    alert('goToChat');
    this.navCtrl.push(ViewchatPage, {
      name: user.name,
      photo: user.profilePicture,
      key: user.$key
    });
    alert('name : ' + user.name +
      '  //photo : ' + user.profilePicture +
      '  //key : ' + user.$key +
      '  //userCur : ' + this.userCur.uid +
      '  //userCurname : ' + this.userCur.displayName);
    
  }


}
