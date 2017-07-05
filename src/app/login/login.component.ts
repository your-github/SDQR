import {Component} from '@angular/core';
import {UserService} from '../service/user.service'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent {
  fLogin: FormGroup;

  loginOpton = {
    timeOut: 3000,
    position: ['top', 'right'],
    showProgressBar: true,
    clickToClose: true,
    animate: 'fromRight',
    pauseOnHover: true
  };

  constructor(
    private  userService: UserService,
    private formBuilder: FormBuilder,
    private notification: NotificationsService,
    private router: Router
  ) {
    this.fLogin = formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
        ]
      ],
      password: ['', Validators.required]
    })
  }

  doLogin() {
    if (this.fLogin.valid) {
      this.userService.login(this.fLogin.value)
        .then((succes) => {
          if (succes) {
            this.notification.success('Login', 'ເຂົ້າສູ່ລະບົບສຳເລັດ', this.loginOpton);
            this.router.navigate(['home']);
          } else {
            this.notification.error('Login', 'ເຂົ້າສູ່ລະບົບລົ້ມເຫຼວ', this.loginOpton);
            this.fLogin.reset();
          }
        }).catch(() => {
        this.notification.error('Login', 'ເຂົ້າສູ່ລະບົບລົ້ມເຫຼວ', this.loginOpton);
        this.fLogin.reset();
      });
    }
  }

}
