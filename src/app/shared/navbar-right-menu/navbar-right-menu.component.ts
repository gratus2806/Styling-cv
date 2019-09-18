import { Component, AfterViewChecked, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../user.service';
import { GlobalService } from '../global.service';
import { Router } from "@angular/router";
import { UserProfileComponent } from 'app/user-profile/user-profile.component';

@Component({
    selector: 'app-navbar-right-menu',
    templateUrl: './navbar-right-menu.component.html',
    styleUrls: ['./navbar-right-menu.component.scss'],
    providers: [UserService]
})  

export class NavBarRightMenuComponent implements AfterViewChecked {
    textDir;
    userDetails;
    currentLang = 'en'; 
    toggleClass = 'ft-maximize';
    placement = 'bottom-right';
    preferred_language;
    public isCollapsed = true;

    @Output() localeChanged: EventEmitter<string> =   new EventEmitter();

    constructor(public translate: TranslateService, public userService: UserService, public globalService: GlobalService, public router: Router) {
        const browserLang: string = translate.getBrowserLang();
        translate.use(browserLang.match(/en|es|pt|de|ar/) ? browserLang : 'en');       
    }

    ngOnInit() {
      this.preferred_language = localStorage.getItem("locale");
      this.userService.getUserProfile().subscribe(
        res => {
          this.userDetails = res['user'];
          console.log("userDetails " , this.userDetails)
          localStorage.setItem('userName', this.userDetails.permalinkSlug);
          // console.log("userDetails " , this.userDetails.preferred_language)
          if(this.userDetails.preferred_language){
            this.preferred_language = this.userDetails.preferred_language;
            this.translate.use(this.userDetails.preferred_language);
            this.globalService.emitProfile(this.userDetails);
          }
        }, 
        err => { 
          console.log(err); 
        }
      );
    }
    
    ngAfterViewChecked() {
        // setTimeout(() => {
        //     var wrapperDiv = document.getElementsByClassName("wrapper")[0];
        //     var dir = wrapperDiv.getAttribute("dir");           
        //     if (dir === 'rtl') {
        //         this.placement = 'bottom-left';
        //     }
        //     else if (dir === 'ltr') {
        //         this.placement = 'bottom-right';
        //     }
        // }, 3000);

        
    }
    onLogout() {
        this.userService.deleteToken();
        this.router.navigate(['/login']);
      }

    ChangeLanguage(language: string) {
      localStorage.setItem("locale", language);
     
      this.translate.use(language);
      if(language =='ar'){ 
          this.textDir = 'rtl';
          this.translate.use(language);
      }else{
          this.textDir = 'ltr';
          this.translate.use(language);
      }
      this.preferred_language = language;
      this.localeChanged.emit(language);
      this.globalService.emitLanuage(language);
        var data = {
            _id: this.userDetails._id,
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            preferred_language: language
        }
        this.userService.savePreferredLangugage(data).subscribe(
            res => {
              this.userService.login(language).subscribe(
                res => {
                  this.userService.setToken(res['token']);
                  this.router.navigateByUrl('/userprofile');
                },
                // err => {
                //   this.serverErrorMessages = err.error.message;
                // }
              );
            },
            err => {
            //   if (err.status === 422) {
            //     this.serverErrorMessages = err.error.join('<br/>');
            //   }
            //   else
            //     this.serverErrorMessages = 'Something went wrong.Please contact admin.';
            }
          );

    }

    ToggleClass() {
        if (this.toggleClass === 'ft-maximize') {  
            this.toggleClass = 'ft-minimize';
        }
        else
            this.toggleClass = 'ft-maximize'
    }
}
