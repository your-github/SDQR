import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {ManagementService} from '../service/management.service'
import {FirebaseListObservable} from 'angularfire2/database';
import {Router} from '@angular/router';

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

  books: FirebaseListObservable<any>;

  constructor(private formBuilder: FormBuilder,
              private notification: NotificationsService,
              private manageService: ManagementService,
              private router: Router) {

    this.fInsert = formBuilder.group({
      catagory: ['', Validators.required],
      author: ['', Validators.required],
      bname: ['', Validators.required],
      import_price: ['', Validators.required],
      export_price: ['', Validators.required],
      quantity: ['', Validators.required, Validators.min(1)],
      description: ['', Validators.required]
    });

    this.fUpdate = formBuilder.group({
      catagory: ['', Validators.required],
      author: ['', Validators.required],
      bname: ['', Validators.required],
      import_price: ['', Validators.required],
      export_price: ['', Validators.required],
      quantity: ['', Validators.required, Validators.min(1)],
      description: ['', Validators.required]
    });

  }

  ngOnInit() {
    const winwidth = window.innerWidth;
    this.resizeWindows(winwidth);
    this.manageService.getBooks().subscribe(success => {
      console.log(success)
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
        console.log(success);
        this.checkInsert = false;
      }).catch(error => {

        console.log(error);
      });
    }
  }

  bookDetail() {
    this.checkDetail = true;
  }

  update() {
    this.checkUpdate = true;
  }

  updateBook(key) {
    if(this.fUpdate.valid){
      this.manageService.updateBook(key, this.fUpdate.value).then(success => {
        console.log(success);
        this.checkUpdate = false;
        this.checkDetail = false;
      }).catch(error => {
        console.log(error);
      })
    }
    this.checkUpdate = false;
    this.checkDetail = false;
  }

  deleteBook(key) {
    this.manageService.deleteBook(key).then(success => {
      console.log(success);
      this.checkUpdate = false;
      this.checkDetail = false;
    }).catch(error => {
      console.log(error);
    })
    this.checkUpdate = false;
    this.checkDetail = false;
  }

}
