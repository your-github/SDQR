import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {ManagementComponent} from './home/management/management.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';


const router: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'management', component: ManagementComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', redirectTo: ''}
];

export const appRoutes = RouterModule.forRoot(router, {useHash: true});
