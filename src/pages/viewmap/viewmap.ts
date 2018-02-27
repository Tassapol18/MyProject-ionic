import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import firebase from 'firebase';
import { Chart } from 'chart.js';
import { ViewchatPage } from '../viewchat/viewchat';

@IonicPage()
@Component({
  selector: 'page-viewmap',
  templateUrl: 'viewmap.html',
})
export class ViewmapPage {

  @ViewChild('barCanvas') barCanvas;

  placeCheckin: FirebaseListObservable<any[]>;
  placeReview: FirebaseListObservable<any[]>;
  userCheckin: FirebaseListObservable<any[]>;
  user: any;
  timestamps: any;
  data: any;

  namePlace: any;
  detailPlace: any;
  placeAddress: any;
  typesPlace: any;
  timePlace: any;
  telephonePlace: any;
  websitePlace: any;
  ownerPlace: any;
  ownerUID: any;
  photoPlaceURL: any;
  distance: any;
  key: any;

  checkUser: boolean = false;

  barChart: any;
  dataSet = new Array;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    private alertCtrl: AlertController) {

    this.key = navParams.get('key');
    this.namePlace = navParams.get('namePlace');
    this.typesPlace = navParams.get('typesPlace');
    this.detailPlace = navParams.get('detailPlace');
    this.placeAddress = navParams.get('placeAddress');
    this.timePlace = navParams.get('timePlace');
    this.telephonePlace = navParams.get('telephonePlace');
    this.websitePlace = navParams.get('websitePlace');
    this.ownerPlace = navParams.get('ownerPlace');
    this.ownerUID = navParams.get('ownerUID');
    this.photoPlaceURL = navParams.get('photoPlaceURL');
    this.distance = navParams.get('distance');

    //Firebase
    this.user = firebase.auth().currentUser;
    this.userCheckin = this.db.list('/Users/' + this.user.uid + '/CheckIn');
    this.placeCheckin = this.db.list('/Maps/' + this.key + '/CheckIn');
    this.placeReview = this.db.list('/Maps/' + this.key + '/Review');
    this.timestamps = firebase.database.ServerValue.TIMESTAMP;

    if(this.user.uid != this.ownerUID){
      this.checkUser = true;
    }
  }

  ionViewWillEnter() {
    this.getScore();
  }

  goToChat() {
        this.navCtrl.push(ViewchatPage, {
          'key': this.ownerUID,
          'name': this.ownerPlace,
        });
        
      }

  getScore() {
    this.placeReview.forEach((res) => {
      this.dataSet = [0, 0, 0, 0, 0];
      for (let i = 0; i < res.length; i++) {
        if (res[i].scoreReview == 1) {
          this.dataSet[0]++;
        } else if (res[i].scoreReview == 2) {
          this.dataSet[1]++;
        } else if (res[i].scoreReview == 3) {
          this.dataSet[2]++;
        } else if (res[i].scoreReview == 4) {
          this.dataSet[3]++;
        } else if (res[i].scoreReview == 5) {
          this.dataSet[4]++;
        }
      }
    })
    this.getChart();
  }

  getChart() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ["ควรปรับปรุง", "พอใช้", "ปานกลาง", "ดี", "ดีมาก"],
        datasets: [{
          label: 'ระดับคะแนนควมพึงพอใจ',
          data: [this.dataSet[0], this.dataSet[1], this.dataSet[2], this.dataSet[3], this.dataSet[4]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }


  checkIn() {
    let alr = this.alertCtrl.create({
      title: 'เช็คอินสถานที่นี้',
      message: 'กรุณากรอกคำอิธบายสำหรับเช็คอินด้วยคำที่สุภาพ',
      inputs: [
        {
          name: 'checkinDetail',
          placeholder: 'คำอธิบาย',
        }
      ],
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          handler: (data) => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'เช็คอิน',
          handler: (data) => {
            this.saveToDatabase(data);
          }
        }
      ]
    });
    alr.present();
  }

  saveToDatabase(data) {
    return new Promise((resolve, reject) => {
      this.placeCheckin.push({
        nameUser: this.user.displayName,
        photoUser: this.user.photoURL,
        uidUser: this.user.uid,
        checkinDetail: data.checkinDetail,
        timestamp: this.timestamps,
      })
        .then(() => {
          this.userCheckin.push({
            namePlace: this.namePlace,
            typesPlace: this.typesPlace,
            photoPlace: this.photoPlaceURL,
            checkinDetail: data.checkinDetail,
            timestamp: this.timestamps,
            keyPlace: this.key,
          })
          alert('บันทึกเช็คอินสำเร็จ');
          console.log(resolve);
        })
        , (err) => {
          alert('ไม่สามารถบันทึกเช็คอินได้ : ' + err);
          console.log(reject);
        }
    })
  }

  reviewPlace() {
    let alr = this.alertCtrl.create({
      title: 'รีวิวสถานที่นี้',
      message: 'กรุณารีวิวสถานที่ด้วยคำที่สุภาพ',
      inputs: [
        {
          name: 'reviewDetail',
          placeholder: 'คำอธิบาย',
        },
      ],
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'ถัดไป',
          handler: data => {
            this.doPoint(data.reviewDetail);
          }
        }
      ]
    });
    alr.present();
  }

  doPoint(reviewDetail) {
    let alr = this.alertCtrl.create({
      title: 'โปรดให้คะแนนสถานที่นี้',
      inputs: [
        {
          type: 'radio',
          label: '5',
          value: '5',
          checked: true
        },
        {
          type: 'radio',
          label: '4',
          value: '4',
        },
        {
          type: 'radio',
          label: '3',
          value: '3',
        },
        {
          type: 'radio',
          label: '2',
          value: '2',
        },
        {
          type: 'radio',
          label: '1',
          value: '1',
        }
      ],
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'ย้อนกลับ',
          handler: () => {
            this.reviewPlace();
          }
        },
        {
          text: 'รีวิว',
          handler: (data) => {
            this.placeReview.push({
              nameUser: this.user.displayName,
              photoUser: this.user.photoURL,
              uidUser: this.user.uid,
              reviewDetail: reviewDetail,
              scoreReview: data,
              timestamp: this.timestamps,
            }).then(() => {
              console.log('Pass');
              this.dataSet = [];
              // this.ionViewWillEnter();
              this.getScore();
              alert('บันทึกรีวิวสำเร็จ');
            }), err => {
              console.log('Fail : ' + err);
              alert('ไม่สามารถบันทึกรีวิวได้ : ' + err);
            }
          }
        }
      ]
    });
    alr.present();
  }



}
