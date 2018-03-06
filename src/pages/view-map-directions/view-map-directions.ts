import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-view-map-directions',
  templateUrl: 'view-map-directions.html',
})
export class ViewMapDirectionsPage {

  @ViewChild('map') mapElement: ElementRef;

  map: any;
  marker: any;

  posCur: any;
  namePlace: any;


  start: any;
  end: any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  // StartConvertLat: any;
  // StartConvertLng: any;
  // EndConvertLat: any;
  // EndConvertLng: any;
  // StartPosition: any;
  // EndPosition: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation) {
    this.start = navParams.get('start');
    this.end = navParams.get('end');
    this.namePlace = navParams.get('namePlace');

    // this.StartConvertLat = parseFloat(this.start.lat);
    // this.StartConvertLng = parseFloat(this.start.lng);
    // this.EndConvertLat = parseFloat(this.end.lat);
    // this.EndConvertLng = parseFloat(this.end.lng);

    // this.StartPosition = {
    //   lat: this.StartConvertLat,
    //   lng: this.StartConvertLng
    // }

    // this.EndPosition = {
    //   lat: this.EndConvertLat,
    //   lng: this.EndConvertLng
    // }

  }

  ionViewWillEnter() {
    this.getCurrentUser();
    this.initMap();
  }

  getCurrentUser() {
    var marker = null;
    this.geolocation.watchPosition().subscribe((data) => {
      var posCur = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
      }
      // this.start = this.posCur;

      if (marker == null) {
        marker = new google.maps.Marker({
          position: posCur,
          map: this.map,
          icon: {
            url: 'assets/imgs/iconMap/personCurrent.png',
            scaledSize: new google.maps.Size(60, 60), // scaled size
          }
        });

      } else {
        marker.setPosition(posCur);
        this.map.panTo(posCur);
      }
    })
  }


  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 12,
      center: this.start,
      mapTypeId: 'roadmap',
      streetViewControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      rotateControl: false,
      fullscreenControl: false,
      disableDefaultUI: true
    });

    this.marker = new google.maps.Marker({
      position: this.end,
      map: this.map
    });

    this.directionsDisplay.setMap(this.map);
    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Directions request failed due to ' + status);
      }
    });
  }


}