import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
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
  namePlace: any;
  typesPlace: any;
  start: any;
  end: any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public statusBar: StatusBar,
    private geolocation: Geolocation) {
    statusBar.backgroundColorByHexString('#750581');
    this.start = navParams.get('start');
    this.end = navParams.get('end');
    this.namePlace = navParams.get('namePlace');
    this.typesPlace = navParams.get('typesPlace');

  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString('#750581');
    this.getCurrentUser();
    this.initMap();
  }

  getCurrentUser() {
    var marker = null;
    this.geolocation.watchPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true })
      .subscribe((data) => {
        var posCur = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        }

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

    var icon;
    var iconHotel = {
      url: 'assets/imgs/iconMap/hotel.png',
      scaledSize: new google.maps.Size(50, 50),
    }
    var iconRest = {
      url: 'assets/imgs/iconMap/resturant.png',
      scaledSize: new google.maps.Size(50, 50),
    }
    var iconTravel = {
      url: 'assets/imgs/iconMap/travel.png',
      scaledSize: new google.maps.Size(50, 50),
    }
    var iconTemple = {
      url: 'assets/imgs/iconMap/temple.png',
      scaledSize: new google.maps.Size(50, 50),
    }
    var iconStore = {
      url: 'assets/imgs/iconMap/store.png',
      scaledSize: new google.maps.Size(50, 50),
    }
    var iconInformation = {
      url: 'assets/imgs/iconMap/information.png',
      scaledSize: new google.maps.Size(50, 50),
    }
    var iconOther = {
      url: 'assets/imgs/iconMap/other.png',
      scaledSize: new google.maps.Size(50, 50),
    }

    if (this.typesPlace == 'ที่พักอาศัย') {
      icon = iconHotel;
    } else if (this.typesPlace == 'ร้านอาหาร') {
      icon = iconRest;
    } else if (this.typesPlace == 'แหล่งท่องเที่ยว') {
      icon = iconTravel;
    } else if (this.typesPlace == 'วัด สถานปฏิบัติธรรม กิจกรรมทางศาสนา') {
      icon = iconTemple;
    } else if (this.typesPlace == 'ร้านค้าของที่ระลึกและสินค้า OTOP') {
      icon = iconStore;
    } else if (this.typesPlace == 'ศูนย์บริการข้อมูลชุมชน') {
      icon = iconInformation;
    } else {
      icon = iconOther;
    }

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
      map: this.map,
      icon: icon,
      animation: google.maps.Animation.DROP,
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
        this.directionsDisplay.setOptions({ suppressMarkers: true });
      } else {
        alert('Directions request failed due to ' + status);
      }
    });
  }




}