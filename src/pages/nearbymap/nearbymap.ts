import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { ViewmapPage } from '../viewmap/viewmap';
import { StatusBar } from '@ionic-native/status-bar';
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
    public statusBar: StatusBar,
    private geolocation: Geolocation) {
    statusBar.backgroundColorByHexString('#750581');
  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString('#750581');
    this.data = [];
    this.initData();
  }

  initData() {
    return new Promise((resolve, reject) => {
      this.mapData = this.db.list('/Maps')
      this.mapData.forEach((res) => {
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
        }
      })
      resolve('พบข้อมูล')
    }).then(() => {
      this.loadPosition()
    })

  }

  loadPosition() {
    this.geolocation.watchPosition({ maximumAge: 3000, enableHighAccuracy: true })
      .subscribe((data) => {
        let posCur = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        }
        this.distance(posCur.lat, posCur.lng);
      })
  }


  distance(latCurrent, lngCurrent) {
    //Math.PI / 180 = 0.017453292519943295
    for (let i = 0; i < this.data.length; i++) {
      let latPlace = parseFloat(this.data[i].LatLng.lat);
      let lngPlace = parseFloat(this.data[i].LatLng.lng);
      let R = 6371; // Earth’s mean radius in kilometer
      let dLat = (latPlace - latCurrent) * Math.PI / 180;
      let dLng = (lngPlace - lngCurrent) * Math.PI / 180;
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((latCurrent) * Math.PI / 180) *
        Math.cos((latPlace) * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;
      this.resultDistance[i] = d.toFixed(2);
      this.data[i].Place.resultDistance = parseFloat(this.resultDistance[i]);
    }

    this.data.sort((a, b) => {
      if (a.Place.resultDistance > b.Place.resultDistance) {
        return 1;
      }
      if (a.Place.resultDistance < b.Place.resultDistance) {
        return -1;
      }
      return 0;
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
