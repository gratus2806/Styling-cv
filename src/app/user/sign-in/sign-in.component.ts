import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { UserService } from '../../shared/user.service';

import { SocialUser, AuthServiceConfig,GoogleLoginProvider, FacebookLoginProvider, LinkedinLoginProvider, AuthService} from 'ng-social-login-module';
import { NgIf } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  // template:`<app-sign-up [signup]=""></app-sign-up>`
})
export class SignInComponent implements OnInit {
  public loginItems:Array<Object> = [
  
  ];
  public user: any = SocialUser;
  constructor(private userService: UserService,private router : Router, private socialAuthService: AuthService,public translate: TranslateService) { }
  abc = { } ;
  model ={
    email :'',
    password:''
  };
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  serverErrorMessages: string;

  preferred_langulage:any;
  ngOnInit() {
    this.loginItems=
    [
      {
      Login:'Login',
      LogInwith:'Log in with',
      or:'or',
      Donthaveanaccount: "Don't have an account",
      Registeredsuccessfully:'Registered successfully',
      Minimum4characters:'Minimum 4 characters',
      Invalidemailaddress:'Invalid email address',
      Signup:'Sign up',
      SignIn:'Sign In',
      ForgotPassword:'Forgot Password',
      Email:'Email',
      Password:'Password',
      toyouraccount:'to your account'
     }
  
    ];  

    console.log(this.userService.isLoggedIn());
    if(this.userService.isLoggedIn())
      this.router.navigateByUrl('/dashboard');
  }

  onSubmit(form : NgForm){
    console.log("onSubmit function called")
    this.userService.login(form.value).subscribe(
      res => {
        this.userService.setToken(res['token']);
        this.router.navigateByUrl('/dashboard');
      },
      err => {
        console.log("err.error.message " , err.error.message)
        this.serverErrorMessages = err.error.message;
      }
    );
  }


  // Social logins
  facebooklogin()
  {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData)=>{
      this.user =userData;
      console.log(this.user);
      this.abc ['email'] = this.user.email;
      this.abc ['password'] = this.user.id;
       this.userService.login(this.abc).subscribe(
        res => {
          this.userService.setToken(res['token']);
          this.router.navigateByUrl('/dashboard');
        },
        err => {
          this.serverErrorMessages = err.error.message;
        }
      );
    });
  
  }

  googlelogin()
  {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData)=>{
      this.user=userData;
      console.log(this.user);
      this.abc ['email'] = this.user.email;
      this.abc ['password'] = this.user.id;
       this.userService.login(this.abc).subscribe(
        res => {
          this.userService.setToken(res['token']);
          this.router.navigateByUrl('/dashboard');
        },
        err => {
          this.serverErrorMessages = err.error.message;
        }
      );

    });
  }

  linkedinlogin()
    {
      this.socialAuthService.signIn(LinkedinLoginProvider.PROVIDER_ID).then((userData)=>{
        this.user=userData;
        console.log(this.user);
        this.abc ['email'] = this.user.email;
      this.abc ['password'] = this.user.id;
       this.userService.login(this.abc).subscribe(
        res => {
          this.userService.setToken(res['token']);
          this.router.navigateByUrl('/dashboard');
        },
        err => {
          this.serverErrorMessages = err.error.message;
        }
      );

      });
    }

    signOut(): void {
      this.socialAuthService.signOut();
      }
}

