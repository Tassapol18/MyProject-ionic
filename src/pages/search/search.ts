import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { StatusBar } from '@ionic-native/status-bar';
import { ViewpostPage } from '../viewpost/viewpost';
import len from 'object-length';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  public PostList: Array<any>;
  public loadePost: Array<any>;
  public postDB: firebase.database.Reference;
  post: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public statusBar: StatusBar,
    public db: AngularFireDatabase) {
    statusBar.backgroundColorByHexString('#e64c05');
    // this.postDB = firebase.database().ref('/Posts');
    // this.postDB.on('value', PostList => {
    //   let posted = [];
    //   PostList.forEach(post => {
    //     posted.push(post.val());
    //     return false;
    //   });
    //   this.PostList = posted;
    //   this.loadePost = posted;
    // });

    this.post = db.list('/Posts');
    this.post.forEach((res) => {
      let posted = [];
      for(let i = 0; i < len(res); i++){
        console.log(res[i]);
        posted.push(res[i]);
      }
      this.PostList = posted;
      this.loadePost = posted;
    })

  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString('#e64c05');
  }

  initializeItem(): void {
    this.PostList = this.loadePost;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItem();

    // set q to the value of the searchbar
    var query = searchbar.srcElement.value;


    // if the value is an empty string don't filter the items
    if (!query) {
      return false;
    }

    this.PostList = this.PostList.filter((v) => {
      if (v.topic && v.detail && query) {
        if (v.topic.toLowerCase().indexOf(query.toLowerCase()) > -1) {
          return true;
        }
        if (v.detail.toLowerCase().indexOf(query.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(query, this.PostList.length);

  }

  viewpost(post) {
    this.navCtrl.push(ViewpostPage, {
      'key': post.$key,
      'name': post.name,
      'email': post.email,
      'topic': post.topic,
      'detail': post.detail,
      'types': post.types,
      'timestamp': post.timestamp,
      'lat': post.lat,
      'lng': post.lng,
      'photoPostURL': post.photoPostURL,
      'view': len(post.view)
    })
  }

}
