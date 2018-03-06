import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';

declare var google;

@IonicPage()
@Component({
  selector: 'page-viewpost',
  templateUrl: 'viewpost.html',
})
export class ViewpostPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any;

  key: any;
  name: any;
  email: any;
  topic: any;
  detail: any;
  types: any;
  timestamp: any;
  lat: any;
  lng: any;
  photoPostURL: any;

  mapShow: boolean = false;
  imageShow: boolean = false;

  viewSum: FirebaseListObservable<any[]>;
  path: any;
  data = [];
  count = 0;



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase) {
    this.key = navParams.get('key');
    this.name = navParams.get('name');
    this.email = navParams.get('email');
    this.topic = navParams.get('topic');
    this.detail = navParams.get('detail');
    this.types = navParams.get('types');
    this.timestamp = navParams.get('timestamp');
    this.lat = navParams.get('lat');
    this.lng = navParams.get('lng');
    this.photoPostURL = navParams.get('photoPostURL');

    if(this.photoPostURL != '-'){
      this.imageShow = true;
    }

    if (this.lat && this.lng != null) {
      this.mapShow = true;
    }

  }

  ionViewWillEnter() {
    // this.count++
    
    // this.path = ('/Posts/' + this.key)
    // this.viewSum = this.db.list('/Posts/')
    // this.viewSum.forEach(res => {
    //   for (let i = 0; i < res.length; i++) {
    //     let temp = {
    //       viewSum: res[i].viewSum
    //     }
    //     this.data.push(temp)
    //   }
    // })
    // console.log(this.data);

    // let sendCount = {
    //   viewSum: this.data
    // }
    // this.db.object(this.path).update(sendCount)
    //   .catch(error => console.log(error));

  }

  ionViewDidLoad() {
    if (this.lat != null && this.lng != null)
      this.initMap();
  }

  initMap() {
    let LatLng = { lat: this.lat, lng: this.lng }
    if (LatLng != null) {
      let map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 12,
        center: LatLng,
        mapTypeId: 'roadmap',
        streetViewControl: false
      });
      this.marker = new google.maps.Marker({
        position: LatLng,
        map: map
      });
    }
  }

}
