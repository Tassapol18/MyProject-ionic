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

  data = new Array();
  resultDistance = new Array();


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    private geolocation: Geolocation) {

  }

  ionViewWillEnter() {
    // this.data = [];     //THis is a bug is true 55555
    this.initData().then(() => {
      this.load();
    })
  }

  initData() {
    return new Promise((resolve, reject) => {
      this.mapData = this.db.list('/Maps');
      var sum = 0;
      this.mapData.forEach(res => {
        this.data = [];
        for (let i = 0; i < res.length; i++) {
          let temp = {
            LatLng: {
              lat: res[i].lat,
              lng: res[i].lng
            },
            Place: {
              namePlace: res[i].namePlace,
              typesPlace: res[i].typesPlace,
              detailPlace: res[i].detailPlace,
              placeAddress: res[i].placeAddress,
              timePlace: res[i].timePlace,
              telephonePlace: res[i].telephonePlace,
              websitePlace: res[i].websitePlace,
              ownerPlace: res[i].ownerPlace,
              ownerUID: res[i].ownerUID,
              photoPlaceURL: res[i].photoPlaceURL
            },
            KeyID: res[i].$key
          }
          this.data.push(temp)
          sum++;
          resolve('load data');
          //end loop
        }
        //end forEach
      });
      reject('fail initData')
    })
  }

  load() {
    //alert("Load...");
    return new Promise((resolve, reject) => {
      this.geolocation.watchPosition().subscribe((res) => {
        let posCur = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        }
        this.distance(posCur.lat, posCur.lng);
        resolve('load')
      })
      reject('fail loadPosition')
    })
  }

  distance(latCurrent, lngCurrent) {
    return new Promise((resolve, reject) => {
      //alert("Lat : Lng User : " + latCurrent + ' , ' + lngCurrent);
      for (let i = 0; i < this.data.length; i++) {
        let latPlace = this.data[i].LatLng.lat;
        let lngPlace = this.data[i].LatLng.lng;
        let R = 6378137; // Earth’s mean radius in meter
        let dLat = (latPlace - latCurrent) * Math.PI / 180;
        let dLng = (lngPlace - lngCurrent) * Math.PI / 180;
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((latCurrent) * Math.PI / 180) *
          Math.cos((latPlace) * Math.PI / 180) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        this.resultDistance[i] = (d / 1000).toFixed(2);
        this.data[i].Place.resultDistance = this.resultDistance[i];
      }
      this.data.sort((a: any, b: any) => {
        if (a.Place.resultDistance > b.Place.resultDistance) {
          return 1;
        } else {
          return 0;
        }
      });
      resolve('load')
    })
  }

  viewdetailMap(data) {
    this.navCtrl.push(ViewmapPage, {
      'key': data.KeyID,
      'namePlace': data.Place.namePlace,
      'typesPlace': data.Place.typesPlace,
      'detailPlace': data.Place.detailPlace,
      'placeAddress': data.Place.placeAddress,
      'timePlace': data.Place.timePlace,
      'telephonePlace': data.Place.telephonePlace,
      'websitePlace': data.Place.websitePlace,
      'ownerPlace': data.Place.ownerPlace,
      'ownerUID': data.Place.ownerUID,
      'photoPlaceURL': data.Place.photoPlaceURL,
      'distance': data.Place.resultDistance,
    })
  }

}
