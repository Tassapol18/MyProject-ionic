import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;


@IonicPage()
@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html',
})
export class MapModalPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  setCurrent: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    public viewCtrl: ViewController) {
    this.getCurrentUser();
  }

  ionViewDidLoad() {
    this.initialize();

  }

  initialize() {
    var marker = null
    let info
    // let latlng = { lat: 15.1179624, lng: 104.9008355 }
    // this.map = new google.maps.Map(this.mapElement.nativeElement, {
    //   zoom: 12,
    //   center: latlng,
    //   mapTypeId: 'roadmap',
    //   streetViewControl: false,
    //   zoomControl: false,
    //   mapTypeControl: false,
    //   scaleControl: false,
    //   rotateControl: false,
    //   fullscreenControl: false,
    //   disableDefaultUI: true
    // });
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true })
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

        this.map.addListener('click', (res) => {
          let data = {
            lat: res.latLng.lat(),
            lng: res.latLng.lng()
          }
          console.log(data);

          if (marker == undefined) {
            marker = new google.maps.Marker({
              position: data,
              map: this.map
            });
            info = "<div id='clickAdd'><center><b>ตำแหน่งที่คุณต้องการ</b></center><br>" +
              "<b>ละติจูดที่ : </b>" + data.lat + "<br><b>ลอนติจูดที่ : </b>" + data.lng + "<br>" +
              "<center><b>กดอีกครั้งเพื่อยืนยัน</b></center></div>";
            console.log(data.lat, data.lng);
            this.AddInfoWindow(marker, info, data);
          } else {
            marker.setPosition(data);
          }
        });
      }).catch((err) => {
        alert('พบปัญหาการแสดงข้อมูลแผนที่ : ' + err)
      })



  }


  getCurrentUser() {
    // อัพเดทตำแหน่งในแผนที่อัตโนมัติ โดยใช้งาน watchPosition 
    // ค่าตำแหน่งจะได้มาเมื่อมีการส่งค่าตำแหน่งที่ถูกต้องกลับมา
    var marker = null;
    let info
    this.setCurrent = {}
    this.geolocation.watchPosition({ maximumAge: 3000, timeout: 15000, enableHighAccuracy: true })
      .subscribe((data) => {
        let posCur = {
          lat: data.coords.latitude,
          lng: data.coords.longitude
        }
        this.setCurrent = posCur

        if (marker == null) {
          marker = new google.maps.Marker({
            position: posCur,
            map: this.map,
            icon: {
              url: 'assets/imgs/iconMap/personCurrent.png',
              scaledSize: new google.maps.Size(60, 60)
            }
          });
          info = "<div id='clickAdd'><center><b>นี่คือตำแหน่งปัจจุบันของคุณ</b></center><br>" +
            "<b>ละติจูดที่ : </b>" + posCur.lat + "<b> , ลอนติจูดที่ : </b>" + posCur.lng + "<br>" +
            "<center><b>กดอีกครั้งเพื่อยืนยัน</b></center></div>";
          this.AddInfoWindow(marker, info, posCur);
        } else {
          marker.setPosition(posCur);
          info = null
        }
      })
  }

  AddInfoWindow(marker, content, position) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    let checkMarker = true;
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker)
      checkMarker = true;
      if (checkMarker) {
        google.maps.event.addListener(infoWindow, 'domready', () => {
          var clickDetail = document.getElementById('clickAdd');
          clickDetail.addEventListener('click', () => {
            this.closeModal(position);
          });
        });
      }
    });
  }

  getLocation() {
    this.map.panTo(this.setCurrent)
    this.map.setZoom(12)
  }

  closeModal(data?) {
    let para_data = data; // กำหนดตัวแปรมารับค่า ถ้ามี
    // แล้วส่งค่าจาก modal กลับมายัง page หลัก ผ่าน dismiss ฟังก์ชั่น
    console.log(para_data);

    this.viewCtrl.dismiss(para_data);
  }

}
