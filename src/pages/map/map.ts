import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewMapPage } from '../new-map/new-map';
import { NearbymapPage } from '../nearbymap/nearbymap';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Geolocation } from '@ionic-native/geolocation';

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
  marker: any;
  data = new Array()

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    public db: AngularFireDatabase) {

  }

  ionViewWillEnter() {
    //alert('Load current marker')
    //this.data = null;
    this.getCurrentUser();
  }

  ionViewDidLoad() {
    alert("Open Map");
    this.loadMap();
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
            photoPlaceURL: res[i].photoPlaceURL
          }
        }
        this.data.push(temp);
      }
      alert("before forEach (for loop) function loadmap : => " + this.data.length);
      this.getDetailMarker();
    });

  }

  goToNearbyMap() {
    this.navCtrl.push(NearbymapPage);
  }

  goToNewMap() {
    this.navCtrl.push(NewMapPage);
  }

  //Lat Long
  loadMap() {
    return new Promise((resolve, reject) => {
      // หาตำแหน่งปัจจุบันโดยใช้ getCurrentPosition เรียกตำแหน่งครั้งแรกครั้งเดียวเมื่อเปิดมาหน้าแผนที่
      this.geolocation.getCurrentPosition()
        .then((res) => {
          var pos = {
            lat: res.coords.latitude,
            lng: res.coords.longitude
          };
          this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 12,
            center: pos,
            mapTypeId: 'roadmap',
            streetViewControl: false
          });

          alert('set center Map : ' + pos.lat + ' ' + pos.lng);
          resolve('load ready');
        }).catch((err) => {
          //alert(err);
          reject('load fail');
        });
    });
  }

  getCurrentUser() {
    //alert('get current user :' + this.data.length)
    //อัพเดทตำแหน่งในแผนที่อัตโนมัติ โดยใช้งาน watchPosition ค่าตำแหน่งจะได้มาเมื่อมีการส่งค่าตำแหน่งที่ถูกต้องกลับมา
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
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        });
        let info = "<b>นี่คือตำแหน่งปัจจุบันของคุณ</b><br>" +
          "<b>ละติจูดที่ : </b>" + posCur.lat + "<b>ลอนติจูดที่ : </b>" + posCur.lng;
        this.AddInfoWindow(marker, info);
        marker.setMap(this.map);
      } else {
        marker.setPosition(posCur);
        this.map.panTo(posCur);
      }
    })

  }

  getDetailMarker() {
    alert("Count Marker... : " + this.data.length);
    for (let i = 0; i < this.data.length; i++) {
      alert("Loader Place => " + this.data[i].Place.namePlace);
      let tmp =
        "<center><img src=" + this.data[i].Place.photoPlace + " width=\"150 px\"></center> <br>" +
        "<b>สถานที่ : </b>" + this.data[i].Place.namePlace + "<br>" +
        "<b>รายละเอียด : </b>" + this.data[i].Place.detailPlace + "<br>" +
        "<b>ที่อยู่ : </b>" + this.data[i].Place.placeAddress + "<br>" +
        "<b>ประเภทของสถานที่ : </b>" + this.data[i].Place.typesPlace + "<br>" +
        "<b>เวลาทำการ : </b>" + this.data[i].Place.timePlace + "<br>" +
        "<b>เบอร์โทรศัพท์ : </b>" + this.data[i].Place.telephonePlace + "<br>" +
        "<b>เว็ปไซต์ : </b>" + this.data[i].Place.websitePlace + "<br>" +
        "<b>สร้างโดย : </b>" + this.data[i].Place.ownerPlace;
      this.ShowMarker(this.data[i].LatLng, tmp);
    }
  }

  ShowMarker(posInfo, info) {
    alert("Function ShowMarker : " + posInfo.lat + ' , ' + posInfo.lng + ' , ' + info);
    let posMarker = {
      lat: posInfo.lat,
      lng: posInfo.lng
    }
    alert('Showmarker : ' + posMarker.lat + ' , ' + posMarker.lng)
    //let position = new google.maps.LatLng(posInfo.lat, posInfo.lng);
    this.marker = new google.maps.Marker({
      position: posMarker,
      map: this.map,
      animation: google.maps.Animation.DROP,
    });
    this.AddInfoWindow(this.marker, info);
  }

  AddInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    //add click show detail
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
}

/*  loadmap

      // const subscription = this.geolocation.watchPosition()
      //   .subscribe(position => {
      //     alert(position.coords.longitude + ' ' + position.coords.latitude);
      //   });

      // this.geolocation.watchPosition().subscribe((data) => {
      //   this.posCur = {
      //     lat: data.coords.latitude,
      //     lng: data.coords.longitude
      //   }
      //   // //alert('current is running : ' + this.posCur.lat + ' ' + this.posCur.lng)
      //   // this.marker = new google.maps.Marker({
      //   //   position: this.posCur,
      //   //   icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      //   //   map: this.map
      //   // })
      //   // this.map.panTo(this.posCur);
      //   // resolve('current is running')

      //   if (this.marker == null) {
      //     this.marker = new google.maps.Marker({
      //       position: this.posCur,
      //       map: this.map,
      //       icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      //     });
      //     //this.marker.setMap(this.map);
      //   } else {
      //     this.marker.setPosition(this.posCur);
      //     this.map.panTo(this.posCur);
      //   }

      //   // To stop notifications
      //   // watch.unsubscribe()
      //   // reject('current is not running')
      // })

*/
  // const map = new google.maps.Map(this.mapElement.nativeElement, {
  //   zoom: 12,
  //   mapTypeId: 'roadmap',
  //   streetViewControl: false
  // })
  // this.geolocation.getCurrentPosition()
  //   .then((res) => {
  //     console.log(res.coords.latitude);
  //     console.log(res.coords.longitude);
  //     let centerMap = {
  //       lat: res.coords.latitude,
  //       lng: res.coords.longitude
  //     }
  //     map.setCenter(centerMap)
  //   }).catch((error) => {
  //     console.log('Error getting location', error);
  //   });

  // const watch = this.geolocation.watchPosition();
  // watch.subscribe((data) => {
  //   this.pos = {
  //     lat: data.coords.latitude,
  //     lng: data.coords.longitude
  //   }
  //   return this.pos
  // });
  // alert(this.pos)
  // this.marker = new google.maps.Marker({
  //   position: this.pos,
  //   map: map,
  // })

  // }
  // setTimeout(() => {
  //   this.watchId = navigator.geolocation.watchPosition((position) => {
  //     console.log("Current Locations", {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     })
  //   }, (error) => {
  //   }, this.options);
  // }, 2000);

  // this.geolocation.getCurrentPosition().then((res) => {
  //   let pos = {
  //     lat: res.coords.latitude,
  //     lng: res.coords.longitude
  //   }
  //   console.log("Positions" + res.coords.latitude + " " + res.coords.longitude);
  //   this.marker = new google.maps.Marker({
  //     position: pos,
  //     icon: userCur,
  //     map: map,
  //     title: 'ตำแหน่งปัจจุบันของคุณ'
  //   });
  //   this.addInfoWindow(this.marker, this.marker.title);
  //   map.setCenter(pos);
  //   this.map = map;

  //   //   setTimeout(() => {
  //   //   let watch = this.geolocation.watchPosition();
  //   //   watch.subscribe((data) => {
  //   //     console.log("Current Locations", {
  //   //             lat: data.coords.latitude,
  //   //             lng: data.coords.longitude
  //   //           })
  //   //   }, (err) => {
  //   //     console.log(err);
  //   //   },)
  //   // },2000)



  //   console.log("addInfo", this.data.length);

  //   let iconCom = '../../assets/imgs/iconMap/community.png';
  //   let iconNat = '../../assets/imgs/iconMap/natural.png';
  //   let iconCul = '../../assets/imgs/iconMap/culture.png';
  //   let iconTra = '../../assets/imgs/iconMap/travel.png';
  //   let iconSum;

  //   for (let i = 0; i < this.data.length; i++) {
  //     console.log("Loader Place => ", this.data[i].Place.namePlace);

  //     if (this.data[i].Place.typesPlace == "ที่พักอาศัย") {
  //       iconSum = iconCom;
  //     } else if (this.data[i].Place.typesPlace == "แหล่งท่องเที่ยว") {
  //       iconSum = iconNat
  //     } else if (this.data[i].Place.typesPlace == "วัด สถานปฏิบัติธรรม กิจกรรมทางศาสนา") {
  //       iconSum = iconCul
  //     } else if (this.data[i].Place.typesPlace == "ร้านค้าของที่ระลึก") {
  //       iconSum = iconTra
  //     } else if (this.data[i].Place.typesPlace == "ศูนย์บริการข้อมูล") {
  //       iconSum = iconCom
  //     } else if (this.data[i].Place.typesPlace == "อื่น ๆ") {
  //       iconSum = iconTra
  //     }

  //     let tmp =
  //       "<center><img src=" + this.data[i].Place.photoPlace + " width=\"150 px\"></center> <br>" +
  //       "<b>สถานที่ : </b>" + this.data[i].Place.namePlace + "<br>" +
  //       "<b>รายละเอียด : </b>" + this.data[i].Place.detailPlace + "<br>" +
  //       "<b>ที่อยู่ : </b>" + this.data[i].Place.placeAddress + "<br>" +
  //       "<b>ประเภทของสถานที่ : </b>" + this.data[i].Place.typesPlace + "<br>" +
  //       "<b>เวลาทำการ : </b>" + this.data[i].Place.timePlace + "<br>" +
  //       "<b>เบอร์โทรศัพท์ : </b>" + this.data[i].Place.telephonePlace + "<br>" +
  //       "<b>เว็ปไซต์ : </b>" + this.data[i].Place.websitePlace + "<br>" +
  //       "<b>สร้างโดย : </b>" + this.data[i].Place.owner + "<br>";

  //     console.log("ShowMarker LatLng", this.data[i].LatLng);
  //     console.log("ShowMarker tmp", tmp);
  //     console.log("ShowMarker icon", iconSum);

  //     this.ShowMarker(this.data[i].LatLng, tmp, iconSum);
  //   }
  // }).catch((error) => {
  //   console.log('Error getting location', error);
  // });
  // }


