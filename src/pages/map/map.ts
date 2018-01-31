import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewMapPage } from '../new-map/new-map';
import { NearbymapPage } from '../nearbymap/nearbymap';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';

declare var google;

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
  watchId: any;
  data = new Array()
  options = {
    enableHighAccuracy: true,
    timeout: 3000,
    maximumAge: 0
  };
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase) {
    this.mapData = db.list('/Maps');

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
            photoPlace: res[i].photoPlace,
          }
        }
        this.data.push(temp)
      }
      //console.log("data before for", this.data);
      this.loadMap()
    })
    //console.log("Map Data", this.mapData);
    

  }


  goToNearbyMap() {
    this.navCtrl.push(NearbymapPage);
  }

  goToNewMap() {
    this.navCtrl.push(NewMapPage);
  }

  ionViewDidLoad() {
    
    console.log("MapPage");

  }

  //Lat Long
  loadMap() {
    var userCur = '../../assets/imgs/iconMap/mapmarkerperson.png';
    let latLng = { lat: 15.12216, lng: 104.906144 }
    let map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 12,
      center: latLng,
      mapTypeId: 'roadmap'
    });


    setTimeout(() => {
      this.watchId = navigator.geolocation.watchPosition((position) => {
        console.log("Current Locations", {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      }, (error) => {
      }, this.options);
    }, 3000);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        //console.log(pos)
        this.marker = new google.maps.Marker({
          position: pos,
          icon: userCur,
          map: map,
          title: 'you is here'
        });



        //console.log("This data in current", this.data.length);


        this.addInfoWindow(this.marker, this.marker.title);
        map.setCenter(pos);
        this.map = map;

        let iconCom = '../../assets/imgs/iconMap/community.png';
        let iconNat = '../../assets/imgs/iconMap/natural.png';
        let iconCul = '../../assets/imgs/iconMap/culture.png';
        let iconTra = '../../assets/imgs/iconMap/travel.png';
        let iconSum;
    
       

        for (let i = 0; i < this.data.length; i++) {
          //console.log("Loader Place", this.data[i].Place);
          if(this.data[i].Place.typesPlace == "ที่พักอาศัย") {
            iconSum = iconCom;
          }else if(this.data[i].Place.typesPlace == "แหล่งท่องเที่ยว"){
            iconSum = iconNat
          }else if(this.data[i].Place.typesPlace == "วัด สถานปฏิบัติธรรม กิจกรรมทางศาสนา"){
            iconSum = iconCul
          }else if(this.data[i].Place.typesPlace == "ร้านค้าของที่ระลึก"){
            iconSum = iconTra
          }else if(this.data[i].Place.typesPlace == "ศูนย์บริการข้อมูล"){
            iconSum = iconCom
          }else if(this.data[i].Place.typesPlace == "อื่น ๆ"){
            iconSum = iconTra
          }

          let tmp =
            "<center><img src=" + this.data[i].Place.photoPlace + " width=\"150 px\"></center> <br>" +
            "<b>สถานที่ : </b>" + this.data[i].Place.namePlace + "<br>" +
            "<b>รายละเอียด : </b>" + this.data[i].Place.detailPlace + "<br>" +
            "<b>ที่อยู่ : </b>" + this.data[i].Place.placeAddress + "<br>" +
            "<b>ประเภทของสถานที่ : </b>" + this.data[i].Place.typesPlace + "<br>" +
            "<b>เวลาทำการ : </b>" + this.data[i].Place.timePlace + "<br>" +
            "<b>เบอร์โทรศัพท์ : </b>" + this.data[i].Place.telephonePlace + "<br>" +
            "<b>เว็ปไซต์ : </b>" + this.data[i].Place.websitePlace + "<br>" +
            "<b>สร้างโดย : </b>" + this.data[i].Place.owener + "<br>";

          this.ShowMarker(this.data[i].LatLng, tmp, iconSum);
        }
        
      }, () => {
        console.log("Check : Browser support Geolocation");
      });
    } else {
      // Browser doesn't support Geolocation
      console.log("Check : Browser doesn't support Geolocation");

    }
  }

  viewmap() {
    alert("ViewmapPage");
    //this.navCtrl.push(ViewmapPage);
  }
  


  ShowMarker(posInfo, info, iconSum) {


    let position = new google.maps.LatLng(posInfo.lat, posInfo.lng);
    let marker_Show = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      icon: iconSum,
      position: position
    });
    let markerInfo = info;
    this.addInfoWindow(marker_Show, markerInfo);
  }

  addInfoWindow(marker, content ) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    //add click show detail
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

}
