import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import moment from 'moment';

declare var google;

@IonicPage()
@Component({
  selector: 'page-viewpost',
  templateUrl: 'viewpost.html',
})
export class ViewpostPage {

  @ViewChild('map') mapElement: ElementRef;
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
  view: any;

  mapShow: boolean = false;
  imageShow: boolean = false;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public statusBar: StatusBar,
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
    this.view = navParams.get('view');



    if (this.photoPostURL != '-') {
      this.imageShow = true;
    }

    if (this.lat && this.lng != null) {
      this.mapShow = true;
    }

  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString('#e64c05');
    this.countView()
    if (this.lat != null && this.lng != null){
      this.initMap();
    }
  }

  Textdetail(): string {
    return this.detail;
  }

  countView() {
    let user = firebase.auth().currentUser;
    let timestamp = firebase.database.ServerValue.TIMESTAMP;
    let path = '/Posts/' + this.key + '/view/' + user.uid;
    let countViewSum = {
      time: timestamp
    }

    this.db.object(path).update(countViewSum);

  }

  viewDate(date) {
    moment.locale('th');
    let time = moment(date).format('LLLL')
    return time;
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
