import { Navigate } from 'react-router-dom'
import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ForgotUsernameComponent} from './forgot-username/forgot-username.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import { AcceptTermsComponent } from './accept-terms/accept-terms.component';

const PublicRoutes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login/:providerName', component: LoginComponent},
  { path: 'login', component: LoginComponent},
  { path: 'forgot-password/:providerName', component: ForgotPasswordComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'forgot-username', component: ForgotUsernameComponent},
  { path:'reset-password/:parentID/:userType/:userId/:isAdmin/:providerName', component: ResetPasswordComponent},
  { path:'terms-conditions/:parentID/:username/:loginMethod/:providerName', component: AcceptTermsComponent}
];

export default PublicRoutes
 