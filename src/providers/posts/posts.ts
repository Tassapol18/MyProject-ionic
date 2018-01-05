import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class PostsProvider {

  constructor(public http: HttpClient, public angularfiredb: AngularFireDatabase) {
    console.log('Hello PostsProvider Provider');
  }

  getPosts() {
    return this.angularfiredb.list('/Users/Posts/');
  }

  addPosts(name, eamil, profilePicture) {
    this.angularfiredb.list('/Users/Posts/').push(this);
  }

  removePosts(key) {
    this.angularfiredb.list('/Users/Posts/').remove(key);
  }

  editPosts(name, eamil, profilePicture, key) {
    this.angularfiredb.list('/Users/Posts/')
  }

}
