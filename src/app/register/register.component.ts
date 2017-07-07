import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
import {PasswordValidators} from 'ngx-validators';
import {NotificationsService} from 'angular2-notifications';
import {ManagementService} from '../service/management.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [ManagementService]
})
export class RegisterComponent implements OnInit {

  fRegister: FormGroup;

  userpic64: any;
  userpic: File;

  pass: string;
  confirm: string;

  toastOpton = {
    timeOut: 3000,
    position: ['top', 'right'],
    showProgressBar: true,
    clickToClose: true,
    animate: 'fromRight',
    pauseOnHover: true
  };

  constructor(
    private router: Router,
    private formBuild: FormBuilder,
    private userService: UserService,
    private notification: NotificationsService,
    private managerService: ManagementService
  ) {
    this.fRegister = formBuild.group({
      'fname': ['', Validators.required],
      'lname': ['', Validators.required],
      'email': [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
        ]
      ],
      'password': ['', Validators.required],
      'confirm': ['', Validators.required]
    }, PasswordValidators.mismatchedPasswords('password', 'confirm'));
  }

  ngOnInit() {
  }

  propic() {
    document.getElementById('propic').click();
  }

  goHome() {
    this.router.navigate(['home']);
  }

  userPicture(event) {
    const file = event.target.files.item(0);
    this.userpic = file;
    const base64 = new FileReader();
    base64.onload = () => {
      this.userpic64 = base64.result;
    }
    base64.readAsDataURL(file);
  }

  register() {
    if (this.fRegister.valid) {
      const user = this.fRegister.value;
      this.userService.register(user).then(success => {
        const userToken = success;
        const userPost = {
          email: user.email,
          fname: user.fname,
          lname: user.lname
        }
        this.userService.saveUser(userPost, userToken).then(saveSuccess => {
          const key = success.path.o[2];
          this.managerService.uploadPicture('/dbook/users/', key, this.userpic).then(picSuccess =>{
            const userpicUrl = picSuccess.downloadURL;
            this.userService.updateUser(key, {upic: userpicUrl}, userToken).then(uSuccess => {
              this.notification.success('User', 'ເພີ່ມຜູ້ໃຊ້ສຳເລັດແລ້ວ', this.toastOpton)
              this.fRegister.reset();
            }).catch(uError => {
              console.log(uError);
            })
          }).catch(picError => {
            console.log(picError);
          })
        }).catch(saveError => {
          /*this.notification.success('User', 'ເພີ່ມຜູ້ໃຊ້ສຳເລັດແລ້ວ', this.toastOpton)*/
          console.log(saveError);
        })
       console.log(success);
       }).catch(error => {
        this.notification.success('User', 'ເພີ່ມຜູ້ໃຊ້ລົ້ມເຫຼວ', this.toastOpton)
       console.log(error);
       });
    }
  }
}
