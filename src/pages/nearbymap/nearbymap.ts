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

  data = new Array()
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
            typesPlace: res[i].typesPlace,
            detailPlace: res[i].detailPlace,
            placeAddress: res[i].placeAddress,
            timePlace: res[i].timePlace,
            telephonePlace: res[i].telephonePlace,
            websitePlace: res[i].websitePlace,
            ownerPlace: res[i].ownerPlace,
            photoPlace: res[i].photoPlace
          }
        }
        this.data.push(temp)
      }
      alert("data before (for loop) : NearbyMap : =>" + this.data.length);
    });
  }

  ionViewWillEnter() {
    alert("This is nearby")
    this.load()
  }

  load() {
    alert("Load...");
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((res) => {
        let posCur = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        }
        this.distance(posCur.lat, posCur.lng);
        resolve('success');
      }).catch((err) => {
        reject('Unsuccess' + err);
      });
    })
  }

  distance(latCurrent, lngCurrent) {
    alert("Lat : Lng User : " + latCurrent + ' , ' + lngCurrent);
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
  }

  viewdetailMap(data) {
    this.navCtrl.push(ViewmapPage, {
      'namePlace': data.Place.namePlace,
      'typesPlace': data.Place.typesPlace,
      'detailPlace': data.Place.detailPlace,
      'placeAddress': data.Place.placeAddress,
      'timePlace': data.Place.timePlace,
      'telephonePlace': data.Place.telephonePlace,
      'websitePlace': data.Place.websitePlace,
      'ownerPlace': data.Place.ownerPlace,
      'photoPlace': data.Place.photoPlace,
      'distance': data.Place.resultDistance
      // 'namePlace': data.Place.namePlace,
      // 'detailPlace': data.Place.detailPlace,
      // 'placeAddress': data.Place.placeAddress,
      // 'typesPlace': data.Place.typesPlace,
      // 'timePlace': data.Place.timePlace,
      // 'telephonePlace': data.Place.telephonePlace,
      // 'websitePlace': data.Place.websitePlace,
      // 'owner': data.Place.owner,
      // 'photoPlace': data.Place.photoPlace,
      // 'distance': data.Place.resultDistance
    })
  }



}
