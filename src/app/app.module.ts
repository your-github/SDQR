import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';


/***Angular Libary*/
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MdButtonModule, MdCardModule, MdDialogModule, MdGridListModule, MdIconModule, MdIconRegistry, MdInputModule,
    MdMenuModule,
    MdProgressSpinnerModule,
    MdSidenavModule, MdSlideToggleModule,
    MdToolbarModule, MdTooltipModule
} from '@angular/material';
import 'hammerjs';
import {FlexLayoutModule} from '@angular/flex-layout';

/*** Angular Firebase*/
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';

/*** Angular notifications*/
import {PushNotificationsModule, SimpleNotificationsModule} from 'angular2-notifications';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ManagementComponent } from './home/management/management.component';


export const firebaseConfig = {
    apiKey: 'AIzaSyDKfhalS9iXAH1Lqr_Z7HcoYF0mHHmHfd0',
    authDomain: 'dbook-8d9fa.firebaseapp.com/',
    databaseURL: 'https://dbook-8d9fa.firebaseapp.com/',
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
        ManagementComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
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
        FlexLayoutModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        PushNotificationsModule,
        SimpleNotificationsModule

    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
