import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MdDialogRef, MdDialog } from '@angular/material';
import {NotificationsService} from 'angular2-notifications';
import {ManagementService} from '../service/management.service';
import {FirebaseListObservable} from 'angularfire2/database';
import {Router} from '@angular/router';
import {UserService} from '../service/user.service'
import {GalleryService} from 'ng-gallery';
import {edSecure} from '../service/encryption/secure';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {ConfirmComponent} from '../confirm/confirm.component';

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
  bimages: Array<{ src: string, thumbnail: string, text: string }>;

  checkInsert = false;
  checkDetail = false;
  checkUpdate = false;
  checkUserPermission = false;
  checkSavedInfo = false;

  /*** form property */
  fInsert: FormGroup;
  fUpdate: FormGroup;

  /** image property */
  frontpic64: any;
  fpic: File;
  backpic64: any;
  bpic: File;
  catename: string;

  /** Users */
  userData: { email: string, fname: string, lname: string, upic?: string };

  /** Categories */
  categories: FirebaseListObservable<any>;

  /** books object */
  books: FirebaseListObservable<any>;
  bDetail: {
    key: string,
    bd: {
      author: string,
      bname: string,
      bpic?: string,
      category: string,
      category_name: string,
      description: string,
      export_price: string,
      fpic?: string,
      import_price: string,
      quantity: string
    }
  };

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
              private  userService: UserService,
              private gallery: GalleryService,
              private secure: edSecure,
              private slimLoadingBarService: SlimLoadingBarService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    const winwidth = window.innerWidth;
    this.resizeWindows(winwidth);
    this.userService.getUser().subscribe(success => {
      this.userData = success[0];
      this.manageService.getCheckUser().then((Tokens) => {
        let userTokens = [];
        let loginToken = this.secure.encrytionUser(localStorage.getItem('sdqrusersession'));
        userTokens = Tokens;
        for(let i=0; i<userTokens.length; i++){
          if(userTokens[i].token == loginToken){
            this.checkUserPermission = true;
            break;
          }
        }
      });
    });
    this.manageService.getCategories().subscribe(success => {
      this.categories = success;
    });

    this.slimLoadingBarService.start(() => {
      console.log("Laoding book complete");
    });
    this.manageService.getBooks().subscribe(success => {
      this.slimLoadingBarService.complete();
      this.books = success;
    });
  }

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

  frontPicture(event) {
    const file = event.target.files.item(0);
    this.fpic = file;
    const base64 = new FileReader();
    base64.onload = () => {
      this.frontpic64 = base64.result;
    }
    base64.readAsDataURL(file);
  }

  backPicture(event) {
    const file = event.target.files.item(0);
    this.bpic = file;
    const base64 = new FileReader();
    base64.onload = () => {
      this.backpic64 = base64.result;
    }
    base64.readAsDataURL(file);
  }

  detailTohome() {
    this.frontpic64 = null;
    this.fpic = null;
    this.backpic64 = null;
    this.bpic = null;
    this.checkUpdate = false;
    this.checkDetail = false;
  }

  insertTohome() {
    this.frontpic64 = null;
    this.fpic = null;
    this.backpic64 = null;
    this.bpic = null;
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
    this.frontpic64 = null;
    this.fpic = null;
    this.backpic64 = null;
    this.bpic = null;
    this.fInsert = this.formBuilder.group({
      category: ['', Validators.required],
      author: ['', Validators.required],
      bname: ['', Validators.required],
      import_price: ['', Validators.required],
      export_price: ['', Validators.required],
      quantity: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.checkInsert = true;
  }

  saveBook() {
    if (this.fInsert.valid) {
      let dialogRef: MdDialogRef<ConfirmComponent>;
      dialogRef = this.dialog.open(ConfirmComponent, {
        height: '170px',
        width: '225px',
      });
      dialogRef.componentInstance.title = "Save Book";
      dialogRef.componentInstance.message = "Are you sure?";
      dialogRef.afterClosed().subscribe(confirm => {
        if(confirm){
          this.checkSavedInfo = true;
          const book = this.fInsert.value;
          book.category_name = this.catename;
          this.manageService.saveBook(book).then(success => {
            const keypath = success.path.o[success.path.o.length - 1];
            if (this.fpic) {
              this.manageService.uploadPicture('/dbook/books/', keypath, this.fpic).then(fSuccess => {
                const frontpic = fSuccess.downloadURL;
                if (this.bpic) {
                  this.manageService.uploadPicture('/dbook/books/', keypath, this.bpic).then(bSuccess => {
                    const backpic = bSuccess.downloadURL;
                    this.manageService.updateBook(keypath, {fpic: frontpic, bpic: backpic}).then(uSuccess => {
                      this.successMessage();
                      this.notification.success('Insert', 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
                      this.fInsert.reset();
                    }).catch(() => {
                      this.successMessage();
                      this.notification.warn('Insert', 'ບັນທຶກຮູບລົ້ມເຫຼວ', this.toastOpton);
                      this.fInsert.reset();
                    });
                  }).catch(() => {
                    this.successMessage();
                    this.notification.warn('Insert', 'ບັນທຶກຮູບລົ້ມເຫຼວ', this.toastOpton);
                    this.fInsert.reset();
                  });
                } else {
                  this.manageService.updateBook(keypath, {fpic: frontpic}).then(uSuccess => {
                    this.successMessage();
                    this.notification.success('Insert', 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
                    this.fInsert.reset();
                  }).catch(() => {
                    this.successMessage();
                    this.notification.warn('Insert', 'ບັນທຶກຮູບລົ້ມເຫຼວ', this.toastOpton);
                    this.fInsert.reset();
                  });
                }
              }).catch(() => {
                this.successMessage();
                this.notification.warn('Insert', 'ບັນທຶກຮູບລົ້ມເຫຼວ', this.toastOpton);
                this.fInsert.reset();
              });
            } else if (this.bpic) {
              this.manageService.uploadPicture('/dbook/books/', keypath, this.bpic).then(bSuccess => {
                const backpic = bSuccess.downloadURL;
                this.manageService.updateBook(keypath, {bpic: backpic}).then(uSuccess => {
                  this.successMessage();
                  this.notification.success('Insert', 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
                  this.fInsert.reset();
                }).catch(() => {
                  this.successMessage();
                  this.notification.warn('Insert', 'ບັນທຶກຮູບລົ້ມເຫຼວ', this.toastOpton);
                  this.fInsert.reset();
                });
              }).catch(() => {
                this.successMessage();
                this.notification.warn('Insert', 'ບັນທຶກຮູບລົ້ມເຫຼວ', this.toastOpton);
                this.fInsert.reset();
              });
            } else {
              this.successMessage();
              this.notification.success('Insert', 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
              this.fInsert.reset();
            }
          }).catch(() => {
            this.checkSavedInfo = false;
            this.notification.error('Insert', 'ບັນທຶກຂໍ້ມູນລົ້ມເຫຼວ', this.toastOpton);
          });
        }
      });
    }
  }

  successMessage() {
    this.checkSavedInfo = false;
    this.frontpic64 = null;
    this.fpic = null;
    this.backpic64 = null;
    this.bpic = null;
  }

  bookDetail(key, book) {
    this.bDetail = {key: key, bd: book};
    this.bimages = [
      {
        src: book.fpic,
        thumbnail: book.fpic,
        text: book.bname + ' | Front Cover'
      },
      {
        src: book.bpic,
        thumbnail: book.bpic,
        text: book.bname + ' | Back Cover'
      }
    ];
    this.gallery.load(this.bimages);
    this.checkDetail = true;
  }

  update() {
    this.frontpic64 = null;
    this.fpic = null;
    this.backpic64 = null;
    this.bpic = null;
    this.fUpdate = this.formBuilder.group({
      category: [this.bDetail.bd.category, Validators.required],
      author: [this.bDetail.bd.author, Validators.required],
      bname: [this.bDetail.bd.bname, Validators.required],
      import_price: [this.bDetail.bd.import_price, Validators.required],
      export_price: [this.bDetail.bd.export_price, Validators.required],
      quantity: [this.bDetail.bd.quantity, Validators.required],
      description: [this.bDetail.bd.description, Validators.required]
    });
    this.checkUpdate = true;
  }

  updateBook() {
    if (this.fUpdate.valid) {
      let dialogRef: MdDialogRef<ConfirmComponent>;
      dialogRef = this.dialog.open(ConfirmComponent, {
        height: '170px',
        width: '225px',
      });
      dialogRef.componentInstance.title = "Update Book";
      dialogRef.componentInstance.message = "Are you sure?";
      dialogRef.afterClosed().subscribe(confirm => {
        if(confirm){
          this.checkSavedInfo = true;
          const book = this.fUpdate.value;
          /*book.fpic = this.frontpic64 ? this.frontpic64 : this.bDetail.bd.fpic;
           book.bpic = this.backpic64 ? this.backpic64 : this.bDetail.bd.bpic;*/
          book.category_name = this.catename;
          console.log(book);
          this.manageService.updateBook(this.bDetail.key, book).then(success => {
            if (this.fpic) {
              this.manageService.uploadPicture('/dbook/books/', this.bDetail.key, this.fpic).then(fSuccess => {
                const frontpic = fSuccess.downloadURL;
                if (this.bpic) {
                  this.manageService.uploadPicture('/dbook/books/', this.bDetail.key, this.bpic).then(bSuccess => {
                    const backpic = bSuccess.downloadURL;
                    this.manageService.updateBook(this.bDetail.key, {fpic: frontpic, bpic: backpic}).then(uSuccess => {
                      this.updateSuccess();
                      this.notification.success('Update', 'ແກ້ໄຂຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
                    }).catch(() => {
                      this.updateSuccess();
                      this.notification.success('Update', 'ແກ້ໄຂຮູບລົ້ມເຫຼວ', this.toastOpton);
                    });
                  }).catch(() => {
                    this.updateSuccess();
                    this.notification.success('Update', 'ແກ້ໄຂຮູບລົ້ມເຫຼວ', this.toastOpton);
                  });
                } else {
                  this.manageService.updateBook(this.bDetail.key, {fpic: frontpic}).then(uSuccess => {
                    this.updateSuccess();
                    this.notification.success('Update', 'ແກ້ໄຂຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
                  }).catch(() => {
                    this.updateSuccess();
                    this.notification.success('Update', 'ແກ້ໄຂຮູບລົ້ມເຫຼວ', this.toastOpton);
                  });
                }
              }).catch(() => {
                this.updateSuccess();
                this.notification.success('Update', 'ແກ້ໄຂຮູບລົ້ມເຫຼວ', this.toastOpton);
              });
            } else if (this.bpic) {
              this.manageService.uploadPicture('/dbook/books/', this.bDetail.key, this.bpic).then(bSuccess => {
                const backpic = bSuccess.downloadURL;
                this.manageService.updateBook(this.bDetail.key, {bpic: backpic}).then(uSuccess => {
                  this.updateSuccess();
                  this.notification.success('Update', 'ແກ້ໄຂຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
                }).catch(() => {
                  this.updateSuccess();
                  this.notification.success('Update', 'ແກ້ໄຂຮູບລົ້ມເຫຼວ', this.toastOpton);
                });
              }).catch(() => {
                this.updateSuccess();
                this.notification.success('Update', 'ແກ້ໄຂຮູບລົ້ມເຫຼວ', this.toastOpton);
              });
            }else {
              this.updateSuccess();
              this.notification.success('Update', 'ແກ້ໄຂຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
            }
          }).catch(() => {
            this.checkSavedInfo = false;
            this.notification.error('Update', 'ເກີດຂໍ້ຜິດພາດແກ້ໄຂຂໍ້ມູນລົ້ມເຫຼວ', this.toastOpton);
          });
        }
      });
    }
  }

  updateSuccess() {
    this.checkSavedInfo = false;
    this.frontpic64 = null;
    this.fpic = null;
    this.backpic64 = null;
    this.bpic = null;
    this.checkUpdate = false;
    this.checkDetail = false;
  }

  deleteBook() {
    let dialogRef: MdDialogRef<ConfirmComponent>;
    dialogRef = this.dialog.open(ConfirmComponent, {
      height: '170px',
      width: '225px',
    });
    dialogRef.componentInstance.title = "Delete Book";
    dialogRef.componentInstance.message = "Are you sure?";
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        this.manageService.deleteBook(this.bDetail.key).then(success => {
          this.notification.success('Delete', 'ລົບຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
          this.frontpic64 = null;
          this.fpic = null;
          this.backpic64 = null;
          this.bpic = null;
          this.checkUpdate = false;
          this.checkDetail = false;
        }).catch(() => {
          this.notification.error('Delete', 'ເກີດຂໍ້ຜິດພາດລົບຂໍ້ມູນສຳເລັດແລ້ວ', this.toastOpton);
        })
      }
    });
  }

  logout() {
    this.userService.logout().then(sucess => {
      if (sucess) {
        localStorage.removeItem('sdqrusersession');
        this.router.navigate(['']);
      } else {
        this.notification.error('Log out', 'ອອກຈາກລະບົບລົ້ມເຫຼວ', this.toastOpton);
      }
    }).catch(() => {
      this.notification.error('Log out', 'ອອກຈາກລະບົບລົ້ມເຫຼວ', this.toastOpton);
    })
  }
  currenCategory(catename){
    this.catename = catename;
  }
}
