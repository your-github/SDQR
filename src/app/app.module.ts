import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {edSecure} from './service/encryption/secure';
import {LoginSecureService} from './protected/login.service';
import {ShareSecureService} from './protected/share.service';


/***Angular Libary*/

import {
  MdButtonModule, MdCardModule, MdDialogModule, MdGridListModule, MdIconModule, MdIconRegistry, MdInputModule,
  MdMenuModule,
  MdProgressSpinnerModule, MdSelectModule,
  MdSidenavModule, MdSlideToggleModule,
  MdToolbarModule, MdTooltipModule
} from '@angular/material';
import 'hammerjs';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


/*** Angular Firebase*/
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';

/*** Angular notifications*/
import {PushNotificationsModule, SimpleNotificationsModule} from 'angular2-notifications';
import {LoginComponent} from './login/login.component';

/*** Component*/
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
/*** Router*/

import {appRoutes} from './app.router';

/*** Gallery*/
import {GalleryConfig, GalleryModule} from 'ng-gallery';
import {ManageComponent} from './home/manage/manage.component';

export const galleryConfig: GalleryConfig = {
  // ...
}

export const firebaseConfig = {
  apiKey: 'AIzaSyDKfhalS9iXAH1Lqr_Z7HcoYF0mHHmHfd0',
  authDomain: 'dbook-8d9fa.firebaseapp.com',
  databaseURL: 'https://dbook-8d9fa.firebaseio.com',
  projectId: 'dbook-8d9fa',
  storageBucket: 'dbook-8d9fa.appspot.com',
  messagingSenderId: '951635947188'
};



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ManageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MdButtonModule,
    MdToolbarModule,
    MdMenuModule,
    MdCardModule,
    MdInputModule,
    MdIconModule,
    MdProgressSpinnerModule,
    MdTooltipModule,
    MdGridListModule,
    MdSidenavModule,
    MdDialogModule,
    MdSlideToggleModule,
    MdSelectModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    PushNotificationsModule,
    SimpleNotificationsModule.forRoot(),
    appRoutes,
    GalleryModule.forRoot(galleryConfig)

  ],
  providers: [edSecure, LoginSecureService, ShareSecureService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
