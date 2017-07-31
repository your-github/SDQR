import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FirebaseListObservable} from 'angularfire2/database';
import {UserService} from '../service/user.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  /** Users */
  userData: { email: string, fname: string, lname: string, upic?: string };

  /**Notification option*/
  toastOpton = {
    timeOut: 3000,
    position: ['top', 'right'],
    showProgressBar: true,
    clickToClose: true,
    animate: 'fromRight',
    pauseOnHover: true
  };

  constructor(private router: Router,
              private  userService: UserService,
              private notification: NotificationsService) {
  }


  ngOnInit() {
    this.userService.getUser().subscribe(success => {
      this.userData = success[0];
    }, error => {
      console.log(error);
    });
  }

  /**Sidenav Event*/
  homeEvt(sidenav) {
    sidenav.close();
    this.router.navigate(['home']);
  }

  reportEvt(sidenav) {
    sidenav.close();
    this.router.navigate(['report']);
  }

  registerEvt(sidenav) {
    sidenav.close();
    this.router.navigate(['register']);
  }

  logout() {
    this.userService.logout().then(sucess => {
      if (sucess) {
        localStorage.removeItem('sdqrusersession');
        this.router.navigate(['']);
      } else {
        this.notification.error('Log out', 'ອອກຈາກລະບົບລົ້ມເຫຼວ', this.toastOpton);
      }
    }).catch(error => {
      this.notification.error('Log out', 'ອອກຈາກລະບົບລົ້ມເຫຼວ', this.toastOpton);
      console.log(error);
    })
  }
}
