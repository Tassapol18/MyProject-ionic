import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database-deprecated";

@Injectable()
export class FirebaseProvider {

  constructor(public http: HttpClient,
    public angularfiredb: AngularFireDatabase) {
    console.log('Hello FirebaseProvider Provider');
  }

  getUser() {
    return this.angularfiredb.list('/Users/');
  }

  addUsers(name, eamil, profilePicture) {
    this.angularfiredb.list('/Users/').push(this);
  }

  removeUsers(key) {
    this.angularfiredb.list('/Users/').remove(key);
  }

  editUsers(name, eamil, profilePicture, key) {
    this.angularfiredb.list('/Users/')
  }

}
