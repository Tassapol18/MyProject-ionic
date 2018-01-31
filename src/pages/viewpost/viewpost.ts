import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


declare var google;

@IonicPage()
@Component({
  selector: 'page-viewpost',
  templateUrl: 'viewpost.html',
})
export class ViewpostPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any;
  
  name: any;
  email: any;
  topic: any;
  detail: any;
  types: any;
  timestamp: any;
  lat: any;
  lng: any;
  photo: any;
  
  

  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {
    this.name = navParams.get('name');
    this.email = navParams.get('email');
    this.topic = navParams.get('topic');
    this.detail = navParams.get('detail');
    this.types = navParams.get('types');
    this.timestamp = navParams.get('timestamp');
    this.lat = navParams.get('lat');
    this.lng = navParams.get('lng');
    this.photo = navParams.get('photo');
    

  }

  ionViewDidLoad(){
    if(this.lat != null && this.lng != null)
    this.initMap();
  }

  initMap() {
    let LatLng = { lat: this.lat , lng: this.lng  }
    let iconCom = '../../assets/imgs/iconMap/community.png';
    let iconNat = '../../assets/imgs/iconMap/natural.png';
    let iconCul = '../../assets/imgs/iconMap/culture.png';
    let iconTra = '../../assets/imgs/iconMap/travel.png';
    let iconSum;
    if(LatLng != null){
      let map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 12,
        center: LatLng,
        mapTypeId: 'roadmap'
        
      });

      if(this.types == "แหล่งท่องเที่ยวชุมชน") {
        iconSum = iconCom;
      }else if(this.types == "แหล่งท่องเที่ยวธรรมชาติ"){
        iconSum = iconNat
      }else if(this.types == "แหล่งท่องเที่ยววัฒนธรรม"){
        iconSum = iconCul
      }else if(this.types == "แหล่งท่องเที่ยวท่องเที่ยว"){
        iconSum = iconTra
      }
      
     
  
      this.marker = new google.maps.Marker({

        position: LatLng,
        map: map,
        icon: iconSum
        

        
      });
    }
  }

}
