import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PostPage } from '../post/post';
import { StatusBar } from '@ionic-native/status-bar';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { SearchPage } from '../search/search';
import { ViewpostPage } from '../viewpost/viewpost';
import len from 'object-length';
import moment from 'moment';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  post: any;
  community: FirebaseListObservable<any[]>;
  natural: FirebaseListObservable<any[]>;
  culture: FirebaseListObservable<any[]>;
  travel: FirebaseListObservable<any[]>;
  other: FirebaseListObservable<any[]>;

  News: string = "All";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public statusBar: StatusBar,
    public db: AngularFireDatabase) {
    statusBar.backgroundColorByHexString('#e64c05');
    this.post = db.list('/Posts', {
      query: {
        orderByChild: 'timestamp',
      },
    });

    this.community = db.list('/Posts', {
      query: {
        orderByChild: 'types',
        equalTo: 'แหล่งท่องเที่ยวในชุมชน'
      }
    });

    this.natural = db.list('/Posts', {
      query: {
        orderByChild: 'types',
        equalTo: 'แหล่งท่องเที่ยวเชิงธรรมชาติ'
      }
    });

    this.culture = db.list('/Posts', {
      query: {
        orderByChild: 'types',
        equalTo: 'แหล่งท่องเที่ยวเชิงวัฒนธรรม'
      }
    });

    this.travel = db.list('/Posts', {
      query: {
        orderByChild: 'types',
        equalTo: 'กิจกรรมท่องเที่ยว'
      }
    });

    this.other = db.list('/Posts', {
      query: {
        orderByChild: 'types',
        equalTo: 'อื่น ๆ'
      }
    });

  }

  viewCount(obj) {
    if (len(obj) > 0) {
      return len(obj)
    } else {
      return 0;
    }
  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString('#e64c05');
  }


  goToSearch(fab: FabContainer) {
    this.navCtrl.push(SearchPage);
    fab.close();

  }

  goToPost(fab: FabContainer) {
    this.navCtrl.push(PostPage);
    fab.close();
  }

  viewDate(date) {
    moment.locale('th');
    let time = moment(date).format('LLLL')
    return time;
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

  // viewpostCommunity(community) {
  //   this.navCtrl.push(ViewpostPage, {
  //     'key': community.$key,
  //     'name': community.name,
  //     'email': community.email,
  //     'topic': community.topic,
  //     'detail': community.detail,
  //     'types': community.types,
  //     'timestamp': community.timestamp,
  //     'lat': community.lat,
  //     'lng': community.lng,
  //     'photoPostURL': community.photoPostURL,
  //   })
  // }

  // viewpostNatural(natural) {
  //   this.navCtrl.push(ViewpostPage, {
  //     'key': natural.$key,
  //     'name': natural.name,
  //     'email': natural.email,
  //     'topic': natural.topic,
  //     'detail': natural.detail,
  //     'types': natural.types,
  //     'timestamp': natural.timestamp,
  //     'lat': natural.lat,
  //     'lng': natural.lng,
  //     'photoPostURL': natural.photoPostURL,
  //   })
  // }

  // viewpostCulture(culture) {
  //   this.navCtrl.push(ViewpostPage, {
  //     'key': culture.$key,
  //     'name': culture.name,
  //     'email': culture.email,
  //     'topic': culture.topic,
  //     'detail': culture.detail,
  //     'types': culture.types,
  //     'timestamp': culture.timestamp,
  //     'lat': culture.lat,
  //     'lng': culture.lng,
  //     'photoPostURL': culture.photoPostURL,
  //   })
  // }

  // viewpostTravel(travel) {
  //   this.navCtrl.push(ViewpostPage, {
  //     'key': travel.$key,
  //     'name': travel.name,
  //     'email': travel.email,
  //     'topic': travel.topic,
  //     'detail': travel.detail,
  //     'types': travel.types,
  //     'timestamp': travel.timestamp,
  //     'lat': travel.lat,
  //     'lng': travel.lng,
  //     'photoPostURL': travel.photoPostURL,
  //   })
  // }

  // viewpostOther(other) {
  //   this.navCtrl.push(ViewpostPage, {
  //     'key': other.$key,
  //     'name': other.name,
  //     'email': other.email,
  //     'topic': other.topic,
  //     'detail': other.detail,
  //     'types': other.types,
  //     'timestamp': other.timestamp,
  //     'lat': other.lat,
  //     'lng': other.lng,
  //     'photoPostURL': other.photoPostURL,
  //   })
  // }



}
