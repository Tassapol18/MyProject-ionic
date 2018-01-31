import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-viewmap',
  templateUrl: 'viewmap.html',
})
export class ViewmapPage {
  namePlace: any;
  detailPlace: any;
  placeAddress: any;
  typesPlace: any;
  timePlace: any;
  telephonePlace: any;
  websitePlace: any;
  owener: any;
  photoPlace: any;
  distance: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.namePlace = navParams.get('namePlace');
    this.detailPlace = navParams.get('detailPlace');
    this.placeAddress = navParams.get('placeAddress');
    this.typesPlace = navParams.get('typesPlace');
    this.timePlace = navParams.get('timePlace');
    this.telephonePlace = navParams.get('telephonePlace');
    this.websitePlace = navParams.get('websitePlace');
    this.owener = navParams.get('owener');
    this.distance = navParams.get('distance');
    if(this.photoPlace == ''){
     this.photoPlace = '../../assets/imgs/iconMap/community.png';
    }else{
      this.photoPlace = navParams.get('photoPlace');
    }
    //this.photo = navParams.get('photo');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewmapPage');
  }

}
