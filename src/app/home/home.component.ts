import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {ManagementService} from '../service/management.service'
import {FirebaseListObservable} from 'angularfire2/database';

import {Router} from '@angular/router';
import {UserService} from '../service/user.service'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  },
  providers: [ManagementService]
})
export class HomeComponent implements OnInit {
  cols: number;

  checkInsert = false;
  checkDetail = false;
  checkUpdate = false;

  /*** form property */
  fInsert: FormGroup;
  fUpdate: FormGroup;

  /** image property */
  frontpic: any;
  backpic: any;

  /** books object */
  books: FirebaseListObservable<any>;
  bDetail: { key: string, bd: Object };

  toastOpton = {
    timeOut: 3000,
    position: ['top', 'right'],
    showProgressBar: true,
    clickToClose: true,
    animate: 'fromRight',
    pauseOnHover: true
  };

  constructor(private formBuilder: FormBuilder,
              private notification: NotificationsService,
              private manageService: ManagementService,
              private router: Router,
              private  userService: UserService) {

    this.fInsert = formBuilder.group({
      category: ['', Validators.required],
      author: ['', Validators.required],
      bname: ['', Validators.required],
      import_price: ['', Validators.required],
      export_price: ['', Validators.required],
      quantity: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.fUpdate = formBuilder.group({
      category: ['', Validators.required],
      author: ['', Validators.required],
      bname: ['', Validators.required],
      import_price: ['', Validators.required],
      export_price: ['', Validators.required],
      quantity: ['', Validators.required],
      description: ['', Validators.required]
    });

  }

  ngOnInit() {
    const winwidth = window.innerWidth;
    this.resizeWindows(winwidth);
    this.manageService.getBooks().subscribe(success => {
      this.books = success;
    }, error => {
      console.log(error);
    });

    console.log('Oninnit Event')
  }

  homeEvt(sidenav) {
    sidenav.close();
    this.router.navigate(['home']);
  }

  registerEvt(sidenav) {
    sidenav.close();
    this.router.navigate(['register']);
  }

  frontPicture(event) {
    this.frontpic = event.target.file[0];
    console.log('Front ' + this.frontpic.filename)
  }

  backPicture(event) {
    this.backpic = event.target.file[0];
    console.log('Back ' + this.backpic.filename)
  }

  detailTohome() {
    this.checkUpdate = false;
    this.checkDetail = false;
  }

  insertTohome() {
    this.checkInsert = false;
  }

  onResize(event) {
    const winwidth = event.target.innerWidth;
    this.resizeWindows(winwidth);
  }

  private resizeWindows(winwidth) {
    if (winwidth <= 414) {
      this.cols = 1;
    } else if (winwidth <= 720) {
      this.cols = 2;
    } else if (winwidth <= 960) {
      this.cols = 3;
    } else {
      this.cols = 4;
    }
  }

  picfile(fileID) {
    document.getElementById(fileID).click();
  }

  addBooks() {
    this.checkInsert = true;
  }

  saveBook() {
    if (this.fInsert.valid) {
      this.manageService.saveBook(this.fInsert.value).then(success => {
        const book = success['path']['o'][2];
        console.log(book);
        this.notification.success('Insert', 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
        this.fInsert.reset();
      }).catch(error => {
        this.notification.error('Insert', 'ບັນທຶກຂໍ້ມູນລົ້ມເຫຼວ', this.toastOpton);
        console.log(error);
      });
    }
  }

  bookDetail(key, book) {
    this.bDetail = {key: key, bd: book};
    this.checkDetail = true;
  }

  update() {
    this.checkUpdate = true;
  }

  updateBook() {
    if (this.fUpdate.valid) {
      this.manageService.updateBook(this.bDetail.key, this.fUpdate.value).then(success => {
        this.notification.success('Update', 'ແກ້ໄຂຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
        this.checkUpdate = false;
        this.checkDetail = false;
      }).catch(error => {
        this.notification.error('Update', 'ເກີດຂໍ້ຜິດພາດແກ້ໄຂຂໍ້ມູນລົ້ມເຫຼວ', this.toastOpton);
        console.log(error);
      })
    }
    this.checkUpdate = false;
    this.checkDetail = false;
  }

  deleteBook() {
    this.manageService.deleteBook(this.bDetail.key).then(success => {
      this.notification.success('Delete', 'ລົບຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
      this.checkUpdate = false;
      this.checkDetail = false;
    }).catch(error => {
      this.notification.error('Delete', 'ເກີດຂໍ້ຜິດພາດລົບຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
      console.log(error);
    })
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
