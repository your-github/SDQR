import { Injectable } from '@angular/core';
import {Router, CanActivate} from '@angular/router';

@Injectable()
export class ShareSecureService  implements CanActivate {

  constructor(private route: Router) { }
  canActivate() {
    if (localStorage.getItem('sdqrusersession')) {
      return true;
    }
    this.route.navigate(['/']);
    return false;
  }

}
