import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { SocialUser, AuthServiceConfig,GoogleLoginProvider, FacebookLoginProvider, LinkedinLoginProvider, AuthService} from 'ng-social-login-module';
import { ForgotPasswordPageComponent } from 'app/pages/content-pages/forgot-password/forgot-password-page.component';
import { LoginPageComponent } from 'app/pages/content-pages/login/login-page.component';
import { RegisterPageComponent } from 'app/pages/content-pages/register/register-page.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { NavbarComponent } from 'app/shared/navbar/navbar.component';
import { FullLayoutComponent } from 'app/layouts/full/full-layout.component';
import { ContentLayoutComponent } from 'app/layouts/content/content-layout.component';
import { MasterLayoutComponent } from 'app/layouts/master-layout/master-layout.component';
import {CustomizerComponent } from 'app/shared/customizer/customizer.component';
import { EditResumeComponent } from 'app/sections/edit-resume/edit-resume.component';
import { PaymentComponent } from 'app/payment/payment.component';
import {PricingComponent} from 'app/pricing/pricing.component';
import {UserProfileComponent} from 'app/user-profile/user-profile.component';
import {ModalsComponent} from 'app/components/bootstrap/modals/modals.component';
import {DragDropComponent} from 'app/components/extra/drag-drop/drag-drop.component';
import {SettingComponent} from 'app/setting/setting.component';

export const appRoutes: Routes = [
    {
        path: 'signup', component: UserComponent,
        children: [{ path: '', component: SignUpComponent }]
    },
    {
        path: 'signup/:language', component: UserComponent,
        children: [{ path: '', component: SignUpComponent }]
    },
    {
        path: 'login', component: UserComponent,    
        children: [{ path: '', component: SignInComponent }]
    },

    {
        path: 'login/:language', component: UserComponent,    
        children: [{ path: '', component: SignInComponent }]
    },
    {
        path: 'forgotPassword', component: ForgotPasswordComponent,
    },
    {
        path: 'resestPassword/:id', component: ResetPasswordComponent,
    },
    {
        path: 'loginPage', component: LoginPageComponent,
        // children: [{ path: '', component: LoginPageComponent }]
    },
    {
        path: 'registerPage', component: RegisterPageComponent,
        // children: [{ path: '', component: LoginPageComponent }]
    },
    {
        path: 'dashboard', component: MasterLayoutComponent,canActivate:[AuthGuard],
        children: [{ path: '', component: UserDashboardComponent }]
        
    },
    {
        path: 'customizer', component: CustomizerComponent,
        
    },
    // {
    //     path: 'personal-info', component: FullLayoutComponent,canActivate:[AuthGuard],
    //     children: [{ path: '', component: PersonalInfoComponent }]
    //     
    // },
    // PersonalInfoComponent
    {
        path: '', redirectTo: '/signup', pathMatch: 'full'
        // path: '', redirectTo: '/login/es', pathMatch: 'full'

    },
    {
        path: 'edit-resume', component: EditResumeComponent
    },
    // {
    //     path: 'edit-resume',  loadChildren: '../sections/edit-resume/edit-resume.module#EditResumeModule'
    // },
    {
        path: 'payment', component: MasterLayoutComponent,canActivate:[AuthGuard],
        children: [{ path: '', component: PaymentComponent }]
        
    },
    {
        path: 'payment/type:', component: MasterLayoutComponent,canActivate:[AuthGuard],
        children: [{ path: '', component: PaymentComponent }]
    },
    // {
    //     path: 'payment/:per_month', component: MasterLayoutComponent,canActivate:[AuthGuard],
    //     children: [{ path: '', component: PaymentComponent }]
    //     // path: 'userdashboard', component: UserDashboardComponent,canActivate:[AuthGuard]
    // },
    {
        path: 'payment/type:', component: MasterLayoutComponent,canActivate:[AuthGuard],
        children: [{ path: '', component: PaymentComponent }]
        // path: 'userdashboard', component: UserDashboardComponent,canActivate:[AuthGuard]
    },
    // {
    //     path: 'payment/:type', component: MasterLayoutComponent,canActivate:[AuthGuard],
    //     children: [{ path: '', component: PaymentComponent }]
    //     // path: 'userdashboard', component: UserDashboardComponent,canActivate:[AuthGuard]
    // },

    {
        path: 'pricing', component: MasterLayoutComponent,canActivate:[AuthGuard],
        children: [{ path: '', component: PricingComponent }]
        
    },
    {
        path: 'profile', component: MasterLayoutComponent,canActivate:[AuthGuard],
        children: [{ path: '', component: UserProfileComponent }]
        
    },
    
    {
        path:'drag',component: ModalsComponent,
    },
    {
        path:'settings',component: SettingComponent,
    },
    // {
    //     path: 'payment?pricing=17.99', component: MasterLayoutComponent,canActivate:[AuthGuard],
    //     children: [{ path: '', component: PricingComponent }]
    //     // path: 'userdashboard', component: UserDashboardComponent,canActivate:[AuthGuard]
    // }
];
