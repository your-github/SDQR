import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
import {PasswordValidators} from 'ngx-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  fRegister: FormGroup;

  userpic64: any;

  pass: string;
  confirm: string;

  constructor(private router: Router, private formBuild: FormBuilder, private userService: UserService) {
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
    const base64 = new FileReader();
    base64.onload = () => {
      this.userpic64 = base64.result;
    }
    base64.readAsDataURL(file);
  }

  register() {
    if (this.fRegister.valid) {
      const user = this.fRegister.value;
      user.pic = this.userpic64;
      console.log(user);
    }
    /*this.userService.register(user).then(success => {
     console.log(success);
     }).catch(error => {
     console.log(error);
     });*/
  }
}
