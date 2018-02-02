import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PostPage } from '../post/post';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { SearchPage } from '../search/search';
import { ViewpostPage } from '../viewpost/viewpost';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  post: FirebaseListObservable<any[]>;
  community: FirebaseListObservable<any[]>;
  natural: FirebaseListObservable<any[]>;
  culture: FirebaseListObservable<any[]>;
  travel: FirebaseListObservable<any[]>;
  other: FirebaseListObservable<any[]>;

  News: string = "All";
  isAndroid: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase) {

    this.post = db.list('/Posts',  {
      query: {
        orderByChild: 'timestamp',
      }
    });

    this.community = db.list('/Posts',  {
      query: {
        orderByChild: 'types',
        equalTo: 'แหล่งท่องในเที่ยวชุมชน'
      }
    });

    this.natural = db.list('/Posts',  {
      query: {
        orderByChild: 'types',
        equalTo: 'แหล่งท่องเที่ยวเชิงธรรมชาติ'
      }
    });

    this.culture = db.list('/Posts',  {
      query: {
        orderByChild: 'types',
        equalTo: 'แหล่งท่องเที่ยวเชิงวัฒนธรรม'
      }
    });

    this.travel = db.list('/Posts',  {
      query: {
        orderByChild: 'types',
        equalTo: 'กิจกรรมท่องเที่ยว'
      }
    });

    this.other = db.list('/Posts',  {
      query: {
        orderByChild: 'types',
        equalTo: 'อื่น ๆ'
      }
    });


  }

  goToSearch() {
    this.navCtrl.push(SearchPage);
  }

  goToPost() {
    this.navCtrl.push(PostPage);
  }

  

  viewpost(post){
    this.navCtrl.push(ViewpostPage, {
      'name': post.name,
      'email': post.email,
      'topic': post.topic,
      'detail': post.detail,
      'types': post.types,
      'timestamp': post.timestamp,
      'lat': post.lat,
      'lng': post.lng,
      'photo': post.photo
    })
  }

  viewpostCommunity(community){
    this.navCtrl.push(ViewpostPage, {
      'name': community.name,
      'email': community.email,
      'topic': community.topic,
      'detail': community.detail,
      'types': community.types,
      'lat': community.lat,
      'lng': community.lng,
      'photo': community.photo
    })
  }

  viewpostNatural(natural){
    this.navCtrl.push(ViewpostPage, {
      'name': natural.name,
      'email': natural.email,
      'topic': natural.topic,
      'detail': natural.detail,
      'types': natural.types,
      'lat': natural.lat,
      'lng': natural.lng,
      'photo': natural.photo
    })
  }

  viewpostCulture(culture){
    this.navCtrl.push(ViewpostPage, {
      'name': culture.name,
      'email': culture.email,
      'topic': culture.topic,
      'detail': culture.detail,
      'types': culture.types,
      'lat': culture.lat,
      'lng': culture.lng,
      'photo': culture.photo
    })
  }

  viewpostTravel(travel){
    this.navCtrl.push(ViewpostPage, {
      'name': travel.name,
      'email': travel.email,
      'topic': travel.topic,
      'detail': travel.detail,
      'types': travel.types,
      'lat': travel.lat,
      'lng': travel.lng,
      'photo': travel.photo
    })
  }

  viewpostOther(other){
    this.navCtrl.push(ViewpostPage, {
      'name': other.name,
      'email': other.email,
      'topic': other.topic,
      'detail': other.detail,
      'types': other.types,
      'lat': other.lat,
      'lng': other.lng,
      'photo': other.photo
    })
  }

}
