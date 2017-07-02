import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class UserService {

  user: Observable<firebase.User>;

  constructor(public Auth: AngularFireAuth) {
    this.user = Auth.authState;
  }

  register(email, password) {
    return this.Auth.auth.createUserWithEmailAndPassword(email, password).then((success) => {
      console.log(success);
      return true;
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }

  login(email, password) {
    return this.Auth.auth.signInWithEmailAndPassword(email, password).then((success) => {
      console.log(success);
      return true;
    }).catch((err) => {
      console.log(err);
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
