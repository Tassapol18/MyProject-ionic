import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";

@Injectable()
export class FirebaseServiceProvider {

  constructor(public angularfiredb: AngularFireDatabase) { }

  getUser() {
    return this.angularfiredb.list('/Users/');
  }
 
  addUsers(name,eamil,profilePicture,key) {
    this.angularfiredb.list('/Users/').push(this);
  }
 
  removeUsers(key) {
    this.angularfiredb.list('/Users/').remove(key);
  }

  editUsers(name,eamil,profilePicture,key){
    this.angularfiredb.list('/Users/')
  }
}