import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
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
  passwordMismatch:boolean = false;
  checkConfirmInputKeyup: boolean = false;

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

  constructor(private router: Router,
              private formBuild: FormBuilder,
              private userService: UserService,
              private notification: NotificationsService,
              private managerService: ManagementService) {
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
    });
  }

  checkPasswordMismatch(){
    this.checkConfirmInputKeyup = true;
    const formValue = this.fRegister.value;
    if(formValue.password == formValue.confirm){
      this.passwordMismatch = true;
    }else {
      this.passwordMismatch = false;
    }
  }

  ngOnInit() {
  }

  clickpic() {
    document.getElementById('clickPic').click();
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
    if (this.fRegister.valid && this.passwordMismatch) {
      const user = this.fRegister.value;
      this.userService.register(user).then(success => {
        const userToken = success;
        const userPost = {
          email: user.email,
          fname: user.fname,
          lname: user.lname
        }
        this.userService.saveUser(userPost, userToken).then(saveSuccess => {
          this.passwordMismatch = false;
          this.checkConfirmInputKeyup = false;
          const key = saveSuccess.path.o[saveSuccess.path.o.length - 1];
          if (this.userpic) {
            this.managerService.uploadPicture('/dbook/users/', key, this.userpic).then(picSuccess => {
              const userpicUrl = picSuccess.downloadURL;
              this.userService.updateUser(key, {upic: userpicUrl}, userToken).then(uSuccess => {
                this.notification.success('User', 'ເພີ່ມຜູ້ໃຊ້ສຳເລັດແລ້ວ', this.toastOpton);
                this.userpic = null;
                this.userpic64 = null;
                this.fRegister.reset();
              }).catch(() => {
                this.notification.warn('User', 'ບັນທຶກຮູບຫຼົ້ມເຫຼວ', this.toastOpton);
                this.userpic = null;
                this.userpic64 = null;
                this.fRegister.reset();
              });
            }).catch(() => {
              this.notification.warn('User', 'ບັນທຶກຮູບຫຼົ້ມເຫຼວ', this.toastOpton);
              this.userpic = null;
              this.userpic64 = null;
              this.fRegister.reset();
            });
          }
        }).catch(() => {
          this.notification.success('User', 'ເພີ່ມຜູ້ໃຊ້ສຳເລັດແລ້ວ', this.toastOpton);
        });
      }).catch(() => {
        this.notification.success('User', 'ເພີ່ມຜູ້ໃຊ້ລົ້ມເຫຼວ', this.toastOpton);
      });
    }
  }
}
