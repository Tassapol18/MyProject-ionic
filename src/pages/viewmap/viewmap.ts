import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-viewmap',
  templateUrl: 'viewmap.html',
})
export class ViewmapPage {

  user: FirebaseListObservable<any[]>;
  map: FirebaseListObservable<any[]>;

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

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public db: AngularFireDatabase) {

    

    this.namePlace = navParams.get('namePlace');
    this.detailPlace = navParams.get('detailPlace');
    this.placeAddress = navParams.get('placeAddress');
    this.typesPlace = navParams.get('typesPlace');
    this.timePlace = navParams.get('timePlace');
    this.telephonePlace = navParams.get('telephonePlace');
    this.websitePlace = navParams.get('websitePlace');
    this.owener = navParams.get('owener');
    this.distance = navParams.get('distance');
    // if(this.photoPlace == ''){
    //  this.photoPlace = '../../assets/imgs/iconMap/community.png';
    // }else{
    //   this.photoPlace = navParams.get('photoPlace');
    // }
    this.photoPlace = navParams.get('photoPlace');
  }

  checkIn(){
    let uid = firebase.auth().currentUser;
    this.user = this.db.list('/Users/'+uid.uid+'/checkIn');    
      let timestamp = firebase.database.ServerValue.TIMESTAMP;

          this.user.push({
            namePlace: this.namePlace,
            detailPlace:  this.detailPlace,
            typesPlace: this.typesPlace,
            timePlace:  this.timePlace,
            telephonePlace: this.telephonePlace,
            websitePlace: this.websitePlace,
            owner: this.owener,
            timestamp: timestamp,
            photoPlace: this.photoPlace,
          }).then(newPost => {
            alert("Check In susccess!!");
          }, error => {
            console.log(error);
          });
  }
  sentReview(detail,score){
    console.log(detail,score);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewmapPage');
  }

}
