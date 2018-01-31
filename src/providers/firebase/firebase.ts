import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database-deprecated";

@Injectable()
export class FirebaseProvider {


  constructor(public http: HttpClient,
    public db: AngularFireDatabase) {
    console.log('Hello FirebaseProvider Provider');
  }

  getUsers() {
    return this.db.list('/Users');
  }

  addUsers(name,email,photo) {
    this.db.list('/Users').push({
      name: name,
      email: email,
      photo: photo
    });
  }

  removeUsers(key) {
    this.db.list('/Users').remove(key);
  }

  editUsers(name, eamil, profilePicture, key) {
    this.db.list('/Users')
  }

}
