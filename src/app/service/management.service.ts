import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

@Injectable()
export class ManagementService {

  db: FirebaseListObservable<any>;

  constructor(private firebasedb: AngularFireDatabase) {
    this.db = firebasedb.list('/dbook/books');
  }

  getBooks(): FirebaseListObservable<any> {
    return this.db;
  }

  saveBook(_data) {
    const data = _data;
    return this.db.push(data).then((success) => {
      return success;
    }).catch((error) => {
      console.log(error)
      return error;
    });
  }

  updateBook(_key, _data) {
    const data = _data;
    const key = _key;
    return this.db.update(key, data).then((success) => {
      return success;
    }).catch((error) => {
      console.log(error)
      return error;
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
