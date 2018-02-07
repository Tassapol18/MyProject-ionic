import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


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

  name: any;
  email: any;
  topic: any;
  detail: any;
  types: any;
  timestamp: any;
  lat: any;
  lng: any;
  photo: any;

  imgShow: boolean;
  mapShow: boolean;




  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
    this.name = navParams.get('name');
    this.email = navParams.get('email');
    this.topic = navParams.get('topic');
    this.detail = navParams.get('detail');
    this.types = navParams.get('types');
    this.timestamp = navParams.get('timestamp');
    this.lat = navParams.get('lat');
    this.lng = navParams.get('lng');
    this.photo = navParams.get('photo');

    if (this.photo != null) {
      this.imgShow = true;
    } else {
      this.imgShow = false;
    }

    if (this.lat && this.lng != null) {
      this.mapShow = true;
    } else {
      this.mapShow = false;
    }

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
