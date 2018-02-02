import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { ViewmapPage } from '../viewmap/viewmap';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-nearbymap',
  templateUrl: 'nearbymap.html',
})
export class NearbymapPage {

  mapData: FirebaseListObservable<any[]>;
  @ViewChild('map') mapElement: ElementRef;

  map: any;
  data = new Array()
  LatLng: any;
  latCurrent: any;
  lngCurrent: any;
  resultDistance = new Array();


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    private geolocation: Geolocation) {
      this.mapData = this.db.list('/Maps');
      this.mapData.forEach(res => {
        for (let i = 0; i < res.length; i++) {
          let temp = {
            LatLng: {
              lat: res[i].lat,
              lng: res[i].lng
            },
            Place: {
              namePlace: res[i].namePlace,
              detailPlace: res[i].detailPlace,
              placeAddress: res[i].placeAddress,
              typesPlace: res[i].typesPlace,
              timePlace: res[i].timePlace,
              telephonePlace: res[i].telephonePlace,
              websitePlace: res[i].websitePlace,
              owener: res[i].owener,
              photoPlace: res[i].photoPlace
            }
          }
          this.data.push(temp)
        }
        console.log("data before (for loop) : NearbyMap : =>", this.data);
      });
    //console.log("Map Data NearbyMap", this.mapData);
  }

  ionViewWillEnter(){
    console.log("This is nearby");
   
    this.load()
  }

  load() {
    console.log("Load...");
    
    this.geolocation.getCurrentPosition().then((res) => {
        console.log("User Current (nearby) : ", res.coords.latitude, res.coords.longitude);
        this.latCurrent = res.coords.latitude;
        this.lngCurrent = res.coords.longitude;
        this.distance(this.latCurrent, this.lngCurrent);
      }).catch((error) => {
        console.log('Error getting location', error);
      });

    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   this.latCurrent = data.coords.latitude;
    //   this.lngCurrent = data.coords.longitude;
    //   this.distance(this.latCurrent, this.lngCurrent);
    // });

  }

  distance(latCurrent, lngCurrent) {
    // console.log("Lat : Lng User : ", latCurrent, lngCurrent);
    let n = 1;
    console.log("----------------- Start -----------------");
    
    for (let i = 0; i < this.data.length; i++) {
      let latPlace = this.data[i].LatLng.lat;
      let lngPlace = this.data[i].LatLng.lng;
      let R = 6378137; // Earth’s mean radius in meter
      let dLat = (latPlace - this.latCurrent) * Math.PI / 180;
      let dLng = (lngPlace - this.lngCurrent) * Math.PI / 180;
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((this.latCurrent) * Math.PI / 180) *
        Math.cos((latPlace) * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;
      this.resultDistance[i] = (d / 1000).toFixed(2);
      this.data[i].Place.resultDistance = this.resultDistance[i];

      console.log("Place", n++, " : ", this.data[i].Place.namePlace);
      console.log("latPlace", latPlace, "lngPlace", lngPlace);
      console.log("dLat : dLng", dLat, dLng);
      console.log("a", a);
      console.log("Distance", this.resultDistance[i], "Kilometer");

    }

    console.log("----------------- Stop -----------------");

  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad NearbyPage');
  // }

  viewdetailMap(data) {
    this.navCtrl.push(ViewmapPage, {
      'namePlace': data.Place.namePlace,
      'detailPlace': data.Place.detailPlace,
      'placeAddress': data.Place.placeAddress,
      'typesPlace': data.Place.typesPlace,
      'timePlace': data.Place.timePlace,
      'telephonePlace': data.Place.telephonePlace,
      'websitePlace': data.Place.websitePlace,
      'owener': data.Place.owener,
      'photoPlace': data.Place.photoPlace,
      'distance': data.Place.resultDistance
    })
  }



}
