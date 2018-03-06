import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewMapPage } from '../new-map/new-map';
import { NearbymapPage } from '../nearbymap/nearbymap';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Geolocation } from '@ionic-native/geolocation';
import { ViewmapPage } from '../viewmap/viewmap';
import { ViewMapDirectionsPage } from '../view-map-directions/view-map-directions';


declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  mapData: FirebaseListObservable<any[]>;
  map: any;
  markers = [];
  count = 0;
  checkMarker: boolean = false;
  category = [];

  nameSearch = [];
  latlngSearch = [];

  loadDataSearch = [];



  start: any;
  end: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    private db: AngularFireDatabase) {

  }


  ionViewWillEnter() {
    this.initLoadMap();
    this.nameSearch = [];
    this.latlngSearch = [];
    this.loadDataSearch = [];
  }

  goToNearbyMap() {
    this.navCtrl.push(NearbymapPage);
  }

  goToNewMap() {
    this.navCtrl.push(NewMapPage);
  }

  initLoadMap() {
    this.getCurrentUser();
    this.initMap().then(data => {
      this.loadData();
    })
  }

  initMap() {
    // หาตำแหน่งปัจจุบันโดยใช้ getCurrentPosition 
    // เรียกตำแหน่งครั้งแรกครั้งเดียวเมื่อเปิดมาหน้าแผนที่
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition()
        .then((res) => {
          var position = {
            lat: res.coords.latitude,
            lng: res.coords.longitude
          };
          this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 12,
            center: position,
            mapTypeId: 'roadmap',
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            rotateControl: false,
            fullscreenControl: false,
            disableDefaultUI: true
          });
          resolve('load ready');
        }).catch((err) => {
          reject('load fail : ' + err)
          alert('load fail : ' + err);
        });
    });
  }

  getCurrentUser() {
    // อัพเดทตำแหน่งในแผนที่อัตโนมัติ โดยใช้งาน watchPosition 
    // ค่าตำแหน่งจะได้มาเมื่อมีการส่งค่าตำแหน่งที่ถูกต้องกลับมา
    var marker = null;
    this.geolocation.watchPosition().subscribe((data) => {
      let posCur = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
      }
      if (marker == null) {
        marker = new google.maps.Marker({
          position: posCur,
          map: this.map,
          // icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          // icon: 'assets/imgs/iconMap/personCurrent.png'
          icon: {
            url: 'assets/imgs/iconMap/personCurrent.png',   
            scaledSize: new google.maps.Size(60, 60), // scaled size
          }
        });
        this.start = posCur;
        let info = "<center><b>นี่คือตำแหน่งปัจจุบันของคุณ</b></center><br>" +
          "<b>ละติจูดที่ : </b>" + posCur.lat + "<b> , ลอนติจูดที่ : </b>" + posCur.lng;
        this.AddInfoWindowUser(marker, info);
        marker.setMap(this.map);
      } else {
        marker.setPosition(posCur);
        // this.map.panTo(posCur);
      }
    })
  }



  loadData() {
    var temp = null;
    return new Promise((resolve, reject) => {
      this.mapData = this.db.list('/Maps');
      resolve('load success');
    }).then(() => {
      this.mapData.forEach(res => {
        var clearMarker = this.count
        this.count = res.length
        if (this.count != clearMarker) {
          for (var i in this.markers) {
            this.markers[i].setMap(null)
          }
        }
        for (let i = 0; i < res.length; i++) {
          console.log('name : ' + res[i].namePlace);
          temp = {
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
              photoPlaceURL: res[i].photoPlaceURL,
              photoPlace: res[i].photoPlace
            },
            KeyID: res[i].$key
          }
          this.getDetailMarker(temp);
          this.category.push(temp)
          // console.log("Types",this.category);
          // Loop for
        }
        // forEach outner
      });
    }).catch((err) => {
      alert('fail initMap : ' + err);
    })
  }

  getDetailMarker(temp) {
    let info =
      "<center><img src=" + temp.Place.photoPlaceURL + " width=\"150px\" height=\"150px\"></center> <br>" +
      "<b>" + temp.Place.namePlace + "</b> <br>" +
      "<b>ประเภท : </b>" + temp.Place.typesPlace + "<br>" +
      "<a id='clickDetail'> ดูรายละเอียดเพิ่มเติม </a> &nbsp;&nbsp;&nbsp; <a id='clickDirections'> แสดงเส้นทาง </a>";
    this.addMarker(temp.LatLng, info, temp);
  }


  addMarker(posInfo, info, temp) {
    console.log(temp.Place.typesPlace);

    var icon;
    var iconHotel = {
      url: 'assets/imgs/iconMap/hotel.png',   
      scaledSize: new google.maps.Size(50, 50), // scaled size
    }
    var iconRest = {
      url: 'assets/imgs/iconMap/resturant.png',  
      scaledSize: new google.maps.Size(50, 50), // scaled size
    }
    var iconTravel = {
      url: 'assets/imgs/iconMap/travel.png',    
      scaledSize: new google.maps.Size(50, 50), // scaled size
    }
    var iconTemple = {
      url: 'assets/imgs/iconMap/temple.png',  
      scaledSize: new google.maps.Size(50, 50), // scaled size
    }
    var iconStore = {
      url: 'assets/imgs/iconMap/store.png', 
      scaledSize: new google.maps.Size(50, 50), // scaled size
    }
    var iconInformation = {
      url: 'assets/imgs/iconMap/information.png',   
      scaledSize: new google.maps.Size(50, 50), // scaled size
    }
    var iconOther = {
      url: 'assets/imgs/iconMap/other.png',   
      scaledSize: new google.maps.Size(50, 50), // scaled size
    }


    if (temp.Place.typesPlace == 'ที่พักอาศัย') {
      icon = iconHotel;
    } else if (temp.Place.typesPlace == 'ร้านอาหาร') {
      icon = iconRest;
    } else if (temp.Place.typesPlace == 'แหล่งท่องเที่ยว') {
      icon = iconTravel;
    } else if (temp.Place.typesPlace == 'วัด สถานปฏิบัติธรรม กิจกรรมทางศาสนา') {
      icon = iconTemple;
    } else if (temp.Place.typesPlace == 'ร้านค้าของที่ระลึกและสินค้า OTOP') {
      icon = iconStore;
    } else if (temp.Place.typesPlace == 'ศูนย์บริการข้อมูลชุมชน') {
      icon = iconInformation;
    } else {
      icon = iconOther;
    }

    var convertLat = parseFloat(posInfo.lat)
    var convertLng = parseFloat(posInfo.lng)
    let posMarker = {
      lat: convertLat,
      lng: convertLng
    }
    var marker = new google.maps.Marker({
      position: posMarker,
      map: this.map,
      icon: icon,
      category: temp.Place.typesPlace,
      animation: google.maps.Animation.DROP,
    });
    // console.log('MKK', marker);
    this.nameSearch.push(temp.Place.namePlace);
    this.latlngSearch[temp.Place.namePlace] = posMarker;

    this.markers.push(marker)
    // this.Getmarkers1.push(marker);

    this.AddInfoWindow(marker, info, temp);
  }

  AddInfoWindow(marker, content, temp) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
      this.checkMarker = true;
      if (this.checkMarker) {
        google.maps.event.addListener(infoWindow, 'domready', () => {
          var clickDetail = document.getElementById('clickDetail');
          clickDetail.addEventListener('click', () => {
            this.goViewDetail(temp);
          });
        });

        google.maps.event.addListener(infoWindow, 'domready', () => {
          var clickDirections = document.getElementById('clickDirections');
          clickDirections.addEventListener('click', () => {
            this.end = temp.LatLng;
            this.goViewMapDirections(temp);
            infoWindow.close();
          });
        });
      }
    });
  }

  AddInfoWindowUser(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  filterMarkers(value) {
    let a = 1;
    var marker;
    console.log('FTGT:', this.markers);
    marker = this.markers;
    for (let i = 0; i < this.category.length; i++) {
      if (marker[i].category == value || value == '') {
        console.log('a', a++, 'place', marker[i].category);
        marker[i].setVisible(true)
      } else {
        marker[i].setVisible(false)
      }
    }
  }

  getLocation() {
    this.geolocation.getCurrentPosition()
      .then((res) => {
        var posCur = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        };
        this.map.panTo(posCur);
        this.map.setZoom(12)
      })

  }

  searchMap(event) {
    let val = event.srcElement.value;
    this.loadDataSearch = [];
    if (!val) {
      return false;
    }

    if (val && val.trim() != '') {
      for (let i of this.nameSearch) {
        if (i.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          this.loadDataSearch.push(i);
        }
      }
    }
  }

  ionViewWillLeave() {
    this.loadDataSearch = []
  }

  searchFind(value) {
    console.log(value);
    this.map.panTo(this.latlngSearch[value]);
    this.map.setZoom(16);
  }

  ///////// Search ///////

  goViewDetail(data) {
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

  goViewMapDirections(data) {
    this.navCtrl.push(ViewMapDirectionsPage, {
      'start': this.start,
      'end': this.end,
      'namePlace': data.Place.namePlace,
    })
  }

}