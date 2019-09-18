import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DragulaModule } from 'ng2-dragula';

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";

import { SidebarComponent ,NgbdModalAddNewSection} from "./sidebar/sidebar.component";
//added by yasser
import { NavBarRightMenuComponent } from "./navbar-right-menu/navbar-right-menu.component";
// import { EditorSidebarComponent } from "./editor-sidebar/editor-sidebar.component";
import { EditorNavbarComponent } from "./editor-navbar/editor-navbar.component";
 
// ./ added by yasser

import { CustomizerComponent } from './customizer/customizer.component';
import { NotificationSidebarComponent } from './notification-sidebar/notification-sidebar.component';
import { ToggleFullscreenDirective } from "./directives/toggle-fullscreen.directive";
import { UserService } from './user.service';
import { AuthService } from './auth/auth.service';

import { AuthGuard } from './auth/auth-guard.service';
import { PaymentComponent } from '../payment/payment.component'; 
// import { NgbdModalArrangeSections } from '../shared/customizer/customizer.component';

import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

import { Ng5SliderModule } from 'ng5-slider';

import { ImageCropperComponent } from 'ngx-img-cropper';

//import { ImageCropperModule } from 'ngx-img-cropper';
 

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
  };

@NgModule({
    exports: [
        CommonModule,
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        EditorNavbarComponent,
        // EditorSidebarComponent,
        CustomizerComponent,
        NotificationSidebarComponent,
        ToggleFullscreenDirective,
        NavBarRightMenuComponent,
        NgbModule,
        TranslateModule,
        ImageCropperComponent
    ],
    imports: [
        FormsModule,
        RouterModule,
        CommonModule,
        NgbModule,
        TranslateModule,
        Ng5SliderModule,
        PerfectScrollbarModule,
        ReactiveFormsModule,
        DragulaModule.forRoot()
    ],
    providers: [UserService, AuthService, AuthGuard,  {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
      }],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        NavBarRightMenuComponent,
        // EditorSidebarComponent,
        CustomizerComponent,
        EditorNavbarComponent,
        NotificationSidebarComponent,
        ToggleFullscreenDirective,
        NgbdModalAddNewSection,
        PaymentComponent,
        ImageCropperComponent
    ],
    entryComponents : [NgbdModalAddNewSection]
})
export class SharedModule { }
