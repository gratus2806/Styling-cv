// import { UserService } from 'app/shared/user.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { UserService } from '../../shared/user.service';
import { SocialUser, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LinkedinLoginProvider, AuthService } from 'ng-social-login-module';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [UserService]
})
export class SignUpComponent implements OnInit {
  public signupItems:Array<Object> = [
  
  ];



  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  showSucessMessage: boolean;
  serverErrorMessages: string;
  abc = {}; //used in
  textDir;
  public user: any = SocialUser;
  constructor(public userService: UserService, private socialAuthService: AuthService, public router: Router,public translate: TranslateService) {

    
    
   }

  ngOnInit() {
    // this.textDir = 'rtl'
    // console.log(this.textDir); 
    this.signupItems=
    [
      {
        Creatingaresumehasneverbeen:'Creating a resume has never been',
        Easier:'Easier',
        CreateyourFREEaccount:'Create your FREE account',
        Professional:'Professional',
        Resume:'Resume',
        Free:'2 Free',
        Resumes:'Resumes',
        Multilingual:'Multilingual',
        Templates:'+12 Templates',
        Design:'Design',
        Unlimited:'Unlimited',
        Entries:'Entries',
        PDFDownloads:'PDF Downloads',
        FreeAccount:'Free Account',
        FirstName:'First Name',
        LastName:'Last Name',
        Email:'Email',
        Password:'Password',
        Thisieldisrequired:'This field is required.',
        Enteratleast4characters:'Enter atleast 4 characters',
        StartCreatingMyResume:'Start Creating My Resume',
        or:'or',
        Signinwith:'Sign in with',
        Haveanaccount:'Have an account?',
        Login:'Login',
        ByusingStylingCVyouareagreeingtoour: 'By using StylingCV you are agreeing to our',
        TermsofService:'Terms of Service',
        Registeredsuccessfully: 'Registered successfully',
        Create: 'Create',
     }
  
    ];

  }

  onSubmit(form: NgForm) {
    this.userService.postUser(form.value).subscribe(
      res => {
        this.userService.login(form.value).subscribe(
          res => {
            this.userService.setToken(res['token']);
            this.router.navigateByUrl('/dashboard');
          },
          err => {
            this.serverErrorMessages = err.error.message;
          }
        );
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
      }
    );
  }

  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      preferred_language: ''
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }

  // SignUp with facebook
  facebooklogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData) => {
      this.user = userData;
      this.abc['email'] = this.user.email;
      let x = this.user.name.split(" ")
      this.abc['firstName'] = x[0];
      this.abc['lastName'] = x[1];
      this.abc['password'] = this.user.id;
      this.user = {};
      this.user = this.abc;
      this.userService.postUser(this.user).subscribe(
        res => {
          this.userService.setToken(res['token']);
          this.router.navigateByUrl('/dashboard');
          this.showSucessMessage = true;
          setTimeout(() => this.showSucessMessage = false, 4000);
        },
        err => {
          if (err.status === 422) {
            this.serverErrorMessages = err.error.join('<br/>');
          }
          else
            this.serverErrorMessages = 'Something went wrong.Please contact admin.';
        }
      );
    });
  }

  // SignUp with Google
  googlelogin() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
      this.user = userData;
      console.log(this.user);
      this.abc['email'] = this.user.email;
      let x = this.user.name.split(" ")
      this.abc['firstName'] = x[0];
      this.abc['lastName'] = x[1];
      this.abc['password'] = this.user.id;
      this.user = {};
      this.user = this.abc;
      console.log(this.user);
      this.userService.postUser(this.user).subscribe(
        res => {
          this.userService.setToken(res['token']);
          this.router.navigateByUrl('/dashboard');
          this.showSucessMessage = true;
          setTimeout(() => this.showSucessMessage = false, 4000);
        },
        err => {
          if (err.status === 422) {
            this.serverErrorMessages = err.error.join('<br/>');
          }
          else
            this.serverErrorMessages = 'Something went wrong.Please contact admin.';
        }
      );
    });
  }

  // SignUp with linkedin
  linkedinlogin() {
    this.socialAuthService.signIn(LinkedinLoginProvider.PROVIDER_ID).then((userData) => {
      this.user = userData;
      console.log(this.user);
      // this.abc['email']  = this.user.email ;
      let x = this.user.name.split(" ")
      this.abc['firstName'] = x[0];
      this.abc['lastName'] = x[1];
      this.abc['password'] = this.user.token;
      this.user = {};
      this.user = this.abc;
      console.log(this.user);
      this.userService.postUser(this.user).subscribe(
        res => {
          this.showSucessMessage = true;
          setTimeout(() => this.showSucessMessage = false, 4000);
        },
        err => {
          if (err.status === 422) {
            this.serverErrorMessages = err.error.join('<br/>');
          }
          else
            this.serverErrorMessages = 'Something went wrong.Please contact admin.';
        }
      );
    });
  }
  signOut(): void {
    this.socialAuthService.signOut();
  }
}