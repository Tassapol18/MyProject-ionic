import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
  selector: 'page-mapown',
  templateUrl: 'mapown.html',
})
export class MapownPage {
  @ViewChild('map') mapElement: ElementRef;

  namePlace: any;
  typesPlace: any;
  detailPlace: any;
  placeAddress: any;
  timePlace: any;
  telephonePlace: any;
  websitePlace: any;
  lat: any;
  lng: any;
  photoPlaceURL: any;

  imgShow: boolean;
  mapShow: boolean;
  marker: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {

    this.namePlace = navParams.get('namePlace');
    this.typesPlace = navParams.get('typesPlace');
    this.detailPlace = navParams.get('detailPlace');
    this.placeAddress = navParams.get('placeAddress');
    this.timePlace = navParams.get('timePlace');
    this.telephonePlace = navParams.get('telephonePlace');
    this.websitePlace = navParams.get('websitePlace');
    this.lat = navParams.get('lat');
    this.lng = navParams.get('lng');
    this.photoPlaceURL = navParams.get('photoPlaceURL');

    if (this.photoPlaceURL != null) {
      this.imgShow = true;
    }

    if (this.lat && this.lng != null) {
      this.mapShow = true;
    }
  }

  ionViewDidLoad() {
    if (this.lat != null && this.lng != null) {
      this.initMap();
    }
  }

  initMap() {
    let LatLng = { lat: this.lat, lng: this.lng }
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
