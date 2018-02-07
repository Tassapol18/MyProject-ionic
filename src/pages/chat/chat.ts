import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { ViewchatPage } from '../viewchat/viewchat';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  user: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase) {

    this.user = db.list('/Users', {
      query: {
        orderByChild: 'uid',
      }
    });

  }


  goToChat(user) {
    alert('goToChat');
    alert('key: ' + user.$key);
    this.navCtrl.push(ViewchatPage, {
      'key': user.$key
    });
    
  }


}
