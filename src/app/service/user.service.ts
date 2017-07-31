import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {edSecure} from '../service/encryption/secure';

@Injectable()
export class UserService {

  user: Observable<firebase.User>;
  db: FirebaseListObservable<any>;

  constructor(public Auth: AngularFireAuth, private firebasedb: AngularFireDatabase, private se: edSecure) {
    if (localStorage.getItem('sdqrusersession')) {
      const u = this.se.encrytionUser(localStorage.getItem('sdqrusersession'));
      this.db = firebasedb.list('/dbook/users/' + u);
    }
    this.user = Auth.authState;
  }

  getUser() {
    return this.db;
  }

  register(data: any) {
    /** Get data from view and prepare to store on users document */

    /*** Get email and password to register on google authentication */
    const email = data.email, password = data.password;

    return this.Auth.auth.createUserWithEmailAndPassword(email, password)
      .then((success) => {
        const registertoken = success.uid + success.m;
        return registertoken;
      }).catch((error) => {
        return false;
      });
  }

  saveUser(userData, regToken) {
    const userdb = this.firebasedb.list('/dbook/users/' + regToken);
    return userdb.push(userData).then(succ => {
      return succ;
    }).catch(err => {
      return false;
    });
  }

  updateUser(_key, _data, regToken) {
    const userdb = this.firebasedb.list('/dbook/users/' + regToken);
    return userdb.update(_key, _data).then(success => {
      return success;
    }).catch(error => {
      return error;
    })
  }

  login(user: any) {
    const email = user.email;
    const password = user.password;
    return this.Auth.auth.signInWithEmailAndPassword(email, password).then((success) => {
      let token = success.uid + success.m;
      this.db = this.firebasedb.list('/dbook/users/' + token);
      token = this.se.encrytionUser(token);
      localStorage.setItem('sdqrusersession', token);
      return true;
    }).catch((err) => {
      return false;
    });
  }

  logout() {
    return this.Auth.auth.signOut().then(() => {
      return true;
    }).catch(() => {
      return false;
    });
  }

}
