import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  public PostList: Array<any>;
  public loadePost: Array<any>;
  public postDB: firebase.database.Reference;

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
    this.postDB = firebase.database().ref('/Posts');
    this.postDB.on('value', PostList => {
      let posted = [];
      PostList.forEach(post => {
        posted.push(post.val());
        return false;
      });
      this.PostList = posted;
      this.loadePost = posted;
    });

  }

  initializeItems(): void {
    this.PostList = this.loadePost;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

}
