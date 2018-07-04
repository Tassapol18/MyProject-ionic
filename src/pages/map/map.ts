import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewMapPage } from '../new-map/new-map';
import { StatusBar } from '@ionic-native/status-bar';
import { NearbymapPage } from '../nearbymap/nearbymap';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Geolocation } from '@ionic-native/geolocation';
import { ViewmapPage } from '../viewmap/viewmap';
import { ViewMapDirectionsPage } from '../view-map-directions/view-map-directions';
import { FabContainer } from 'ionic-angular/components/fab/fab-container';


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
  checkMarker: boolean = false;
  category = [];
  nameSearch = [];
  latlngSearch = [];
  loadDataSearch = [];
  start: any;
  end: any;
  count: any;
  setCurrent: any;
  searchInput: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    public statusBar: StatusBar,
    private db: AngularFireDatabase) {
    statusBar.backgroundColorByHexString('#750581');

    this.getCurrentUser();
    this.initMap();

  }



  ionViewWillEnter() {
    this.loadData();
    this.count = 0;
    this.statusBar.backgroundColorByHexString('#750581');
  }

  ionViewWillLeave() {
    this.loadDataSearch = [];
  }


  goToNearbyMap() {
    this.navCtrl.push(NearbymapPage);
  }

  goToNewMap() {
    this.navCtrl.push(NewMapPage);
  }

  getCurrentUser() {
    // อัพเดทตำแหน่งในแผนที่อัตโนมัติ โดยใช้งาน watchPosition 
    // ค่าตำแหน่งจะได้มาเมื่อมีการส่งค่าตำแหน่งที่ถูกต้องกลับมา
    var marker = null;
    this.setCurrent = {}
    this.geolocation.watchPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true })
      .subscribe((data) => {
        let posCur = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        }
        this.setCurrent = posCur
        console.log(this.setCurrent);

        if (marker == null) {
          marker = new google.maps.Marker({
            position: posCur,
            map: this.map,
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

  initMap() {
    // หาตำแหน่งปัจจุบันโดยใช้ getCurrentPosition 
    // เรียกตำแหน่งครั้งแรกครั้งเดียวเมื่อเปิดมาหน้าแผนที่
    this.map = null;
    this.geolocation.getCurrentPosition({ maximumAge: 5000, timeout: 10000, enableHighAccuracy: true })
      .then((pos) => {
        let position = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
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
        this.loadData();
      }).catch((err) => {
        alert('เกิดข้อผิดพลาดเกี่ยวกับแผนที่ : ' + err)
      })
  }

  loadData() {
    var temp = null;
    this.mapData = this.db.list('/Maps');
    this.mapData.forEach((res) => {
      this.count = 0;
      this.nameSearch = [];
      this.latlngSearch = [];
      this.loadDataSearch = [];
      temp = {}
      var clearMarker = this.count
      this.count = res.length
      if (this.count != clearMarker) {
        for (var i in this.markers) {
          this.markers[i].setMap(null)
        }
      }
      for (let i = 0; i < res.length; i++) {
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
      }
    })
  }

  getDetailMarker(temp) {
    let info = null;
    info =
      "<center><img src=" + temp.Place.photoPlaceURL + " width=\"200px\" height=\"200px\"></center> <br>" +
      "<b>" + temp.Place.namePlace + "</b> <br>" +
      "<b>ประเภท : </b>" + temp.Place.typesPlace + "<br>" +
      "<a id='clickDetail'> ดูรายละเอียดเพิ่มเติม </a> &nbsp;&nbsp;&nbsp; <a id='clickDirections'> แสดงเส้นทาง </a>";
    this.addMarker(temp.LatLng, info, temp);
  }


  addMarker(posInfo, info, temp) {
    var marker;
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
    marker = new google.maps.Marker({
      position: posMarker,
      map: this.map,
      icon: icon,
      category: temp.Place.typesPlace,
      animation: google.maps.Animation.DROP,
    });
    this.nameSearch.push(temp.Place.namePlace);
    this.latlngSearch[temp.Place.namePlace] = posMarker;
    this.markers.push(marker)
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
            // infoWindow.close();
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

  filterMarkers(value,fab: FabContainer) {
    var marker;
    marker = this.markers;
    for (let i = 0; i < this.category.length; i++) {
      if (marker[i].category == value || value == '') {
        marker[i].setVisible(true)
      } else {
        marker[i].setVisible(false)
      }
    }
    fab.close();
  }

  getLocation() {
    this.map.panTo(this.setCurrent)
    this.map.setZoom(12)
  }

  searchMap(event) {
    // let val = event.srcElement.value;
    let val = this.searchInput;
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

  searchFind(value) {
    this.map.panTo(this.latlngSearch[value]);
    this.map.setZoom(16);
    this.searchInput = null;
    this.loadDataSearch = [];
  }

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
      'distance': '-',
    })
  }

  goViewMapDirections(data) {
    this.navCtrl.push(ViewMapDirectionsPage, {
      'start': this.start,
      'end': this.end,
      'namePlace': data.Place.namePlace,
      'typesPlace': data.Place.typesPlace,
    })
  }

}