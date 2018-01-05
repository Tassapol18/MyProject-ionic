import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';


@Injectable()
export class MapsProvider {

  constructor(public http: HttpClient, public angularfiredb: AngularFireDatabase) {
    console.log('Hello MapsProvider Provider');
  }

  getMaps() {
    return this.angularfiredb.list('/Users/Maps/');
  }

  addMaps(name, eamil, profilePicture) {
    this.angularfiredb.list('/Users/Maps/').push(this);
  }

  removeMaps(key) {
    this.angularfiredb.list('/Users/Maps/').remove(key);
  }

  editMaps(name, eamil, profilePicture, key) {
    this.angularfiredb.list('/Users/Maps/')
  }


}
