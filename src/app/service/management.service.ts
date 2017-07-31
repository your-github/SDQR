import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class ManagementService {

  db: FirebaseListObservable<any>;

  constructor(private firebasedb: AngularFireDatabase) {
    this.db = firebasedb.list('/dbook/books');
  }

  getCategories(): FirebaseListObservable<any> {
    const catagories = this.firebasedb.list('/dbook/categories');
    return catagories;
  }

  getCheckUser(): any{
    return new Promise((resolve, reject) => {
      this.firebasedb.list('/dbook/permission').subscribe(token => {
        resolve(token);
      }, error => {
        reject(error);
      });
    });
  }

  getBooks(): FirebaseListObservable<any> {
    return this.db;
  }

  saveBook(_data) {
    const data = _data;
    return this.db.push(data).then((success) => {
      return success;
    }).catch((error) => {
      return false;
    });
  }

  uploadPicture(path, key, file: File) {
    const firebaseStorage = firebase.storage().ref();
    return firebaseStorage.child(path + key + '/' + file.name).put(file).then(success => {
      return success;
    }).catch(fError => {
      return false;
    })
  }

  updateBook(_key, _data) {
    const data = _data;
    const key = _key;
    return this.db.update(key, data).then((success) => {
      return true;
    }).catch((error) => {
      return false;
    });
  }

  deleteBook(_key) {
    const key = _key;
    return this.db.remove(key).then(success => {
      return true;
    }, err => {
      return false;
    });
  }

}
