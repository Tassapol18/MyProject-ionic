import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PostPage } from '../post/post';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  News: string = "All";
  isAndroid: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToPost(){
    this.navCtrl.push(PostPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListMasterPage');
  }

}
