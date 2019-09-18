
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from "./shared/shared.module";
import { ToastrModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS ,HttpClientJsonpModule } from '@angular/common/http';
import {JsonpModule} from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import { DragulaModule } from 'ng2-dragula';
import { AppComponent } from './app.component';
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { AuthService } from './shared/auth/auth.service';
// import { AuthGuard } from './shared/auth/auth-guard.service';
import { AuthGuard } from '../app/auth/auth.guard';
import { AuthInterceptor } from '../app/auth/auth.interceptor';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { appRoutes } from './routes';
// import { UserProfileComponent } from './user-profile/user-profile.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SocialLoginModule, AuthServiceConfig,GoogleLoginProvider, FacebookLoginProvider, LinkedinLoginProvider} from 'ng-social-login-module';
import { ForgotPasswordPageComponent } from 'app/pages/content-pages/forgot-password/forgot-password-page.component';
import { LoginPageComponent } from 'app/pages/content-pages/login/login-page.component';
import { RegisterPageComponent } from 'app/pages/content-pages/register/register-page.component';
import { ForgotPasswordComponent, ForgotPasswordModalContent } from './user/forgot-password/forgot-password.component';
import { ResetPasswordComponent, ResetPasswordModalContent } from './user/reset-password/reset-password.component';
import { MasterLayoutComponent } from './layouts/master-layout/master-layout.component';
import { UserDashboardComponent,NgbdModalContent,NgbdModalResumeContent,NgbdModalResumeDeleteContent } from './user-dashboard/user-dashboard.component';
import { PersonalInfoComponent } from './sections/personal-info/personal-info.component';
import { NgbdModalArrangeSections } from '../app/shared/customizer/customizer.component'
import { NgbdModalTemplateLists } from '../app/shared/customizer/customizer.component'
// import { PersonalInfoComponent } from './personal-info/personal-info.component';
// import { SummaryComponent } from './summary/summary.component';
// import { SummaryComponent } from './sections/summary/summary.component';
import { WorkExperienceComponent } from './sections/work-experience/work-experience.component';
// import { PersonalInfoComponent } from './sections/personal-info/personal-info.component';
import { CoursesComponent } from './sections/courses/courses.component';
import { LanguagesComponent } from './sections/languages/languages.component';
import { SkillsCompetencesComponent } from './sections/skills-competences/skills-competences.component';
import { HobbiesInterestsComponent } from './sections/hobbies-interests/hobbies-interests.component';
import { EmptySpaceComponent } from './sections/empty-space/empty-space.component';
// import { SkillsComponent } from './sections/skills/skills.component';
import { HobbiesComponent } from './sections/hobbies/hobbies.component';
import { AwardsComponent } from './sections/awards/awards.component';
import { CertificationsComponent } from './sections/certifications/certifications.component';
import { InterestsComponent } from './sections/interests/interests.component';
import { ClientsLogosComponent } from './sections/clients-logos/clients-logos.component';
import { SoftwareComponent } from './sections/software/software.component';
import { FreeTextComponent } from './sections/free-text/free-text.component';
import { ReferencesComponent } from './sections/references/references.component';
import { WorldMapComponent } from './sections/world-map/world-map.component';
import { PortfolioComponent } from './sections/portfolio/portfolio.component';
import { PublicationsComponent } from './sections/publications/publications.component';
// import { PersonalInfoComponent } from './personal-info/personal-info.component';
// import { SummaryComponent } from './summary/summary.component';
import { FindAJobComponent } from './find-a-job/find-a-job.component';
import { SectionsComponent } from './sections/sections.component';
import { HeaderComponent } from './sections/header/header.component';
// import { EditResumeComponent } from './sections/edit-resume/edit-resume.component';
import {EditResumeModule} from './sections/edit-resume/edit-resume.module';
import {AreasOfExpertiseModule} from './sections/areas-of-expertise/areas-of-expertise.module';
import {AwardsModule} from './sections/awards/awards.module';
import { PricingComponent } from './pricing/pricing.component';
import { UserProfileComponent, NgbdModalUserDeleteContent, } from './user-profile/user-profile.component';
import {DragDropComponent } from  './components/extra/drag-drop/drag-drop.component';
import {ModalsComponent } from  './components/bootstrap/modals/modals.component';
import { AreasOfExpertiseComponent } from './sections/areas-of-expertise/areas-of-expertise.component';
import {RenameModalComponent  } from './common_modals/rename_modal/rename-modal.component';
import { IntroductionComponent } from './sections/introduction/introduction.component';

import { SettingComponent } from './setting/setting.component';
import { RenameSectionComponent } from './common_modals/rename-section/rename-section.component';


const config = new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider('268125554196-7uq0iqmi2g8r6fclqs5kh9ff9pe9dg03.apps.googleusercontent.com')
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('360669154754170')
    },
    {
      id: LinkedinLoginProvider.PROVIDER_ID,
      provider: new LinkedinLoginProvider('8197sfqu6do2fq')
    }
  
  ], false);

  export function provideConfig() {
    return config;
  }

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
    declarations: [
        AppComponent,
        FullLayoutComponent,
        ContentLayoutComponent,
        UserComponent,
        SignUpComponent,
        SignInComponent,
        ForgotPasswordPageComponent,
        LoginPageComponent,
        RegisterPageComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        MasterLayoutComponent,
        UserDashboardComponent,
        NgbdModalContent,
        RenameModalComponent,
        NgbdModalResumeContent,
        NgbdModalResumeDeleteContent,
        NgbdModalUserDeleteContent,
        ForgotPasswordModalContent,
        ResetPasswordModalContent,
        HeaderComponent,
        
        FindAJobComponent,
        SectionsComponent,
       // PersonalInfoComponent,
        // EditResumeComponent,
        PricingComponent,
        UserProfileComponent,
        DragDropComponent,
        ModalsComponent,
        NgbdModalArrangeSections,

        NgbdModalTemplateLists,
        // IntroductionComponent,
        // AreasOfExpertiseComponent,
        // ComputerSkillsComponent,

        // AreaOfExpertiseComponent
        // ModalComponent
        SettingComponent,
        RenameSectionComponent,
        
        // EditReferencesModalComponent,
        
        // EditSoftwareModalComponent,
        
        // EditCertificationsModalComponent,
        
        // EditInterestsModalComponent
        
    ],
    imports: [
        FormsModule,

         SocialLoginModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        AppRoutingModule,
        SharedModule,
        DragulaModule.forRoot(),
        HttpClientModule,
        HttpClientJsonpModule,
        JsonpModule,
        ToastrModule.forRoot(),
        NgbModule.forRoot(),
        EditResumeModule,
        AreasOfExpertiseModule,
        AwardsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBr5_picK8YJK7fFR2CPzTVMj6GG1TtRGo'
        }),
        RouterModule.forRoot(appRoutes)
    ],

    providers: [
        {
            provide: AuthServiceConfig,
              useFactory: provideConfig
            },
        {
            // provide: HTTP_INTERCEPTORS,
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        AuthService,
        AuthGuard,
        NgbActiveModal
    ],
    bootstrap: [AppComponent],
    entryComponents : [NgbdModalContent,NgbdModalResumeContent,NgbdModalResumeDeleteContent, NgbdModalUserDeleteContent,ForgotPasswordModalContent, ResetPasswordModalContent, NgbdModalArrangeSections, NgbdModalTemplateLists, RenameSectionComponent]
})
export class AppModule { }