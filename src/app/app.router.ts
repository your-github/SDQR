import {Routes, RouterModule} from '@angular/router';
import {LoginSecureService} from './protected/login.service';
import {ShareSecureService} from './protected/share.service';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';


const router: Routes = [
  {path: '', component: LoginComponent/*, canActivate: [LoginSecureService]*/},
  {path: 'home', component: HomeComponent/*, canActivate: [ShareSecureService]*/},
  {path: 'register', component: RegisterComponent/*, canActivate: [ShareSecureService]*/},
  {path: '**', redirectTo: ''}
];

export const appRoutes = RouterModule.forRoot(router, {useHash: true});
