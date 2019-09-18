// import { Component, ViewChild } from '@angular/core';
// import { NgForm } from '@angular/forms';
// import { Router, ActivatedRoute } from "@angular/router";

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { UserService } from '../../../shared/user.service';

import { SocialUser, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LinkedinLoginProvider, AuthService } from 'ng-social-login-module';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {
  public user: any = SocialUser;
  @ViewChild('f') loginForm: NgForm;
  abc = {};
  model = {
    email: '',
    password: ''
  };
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  serverErrorMessages: string;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private socialAuthService: AuthService) { }

  ngOnInit() {
    if (this.userService.isLoggedIn())
      this.router.navigateByUrl('/dashboard');
  }

  // On submit button click    
  onSubmit() {
    console.log("this.loginForm ", this.loginForm.value)
    this.userService.login(this.loginForm.value).subscribe(
      res => {
        this.userService.setToken(res['token']);
        this.router.navigateByUrl('/dashboard');
      },
      err => {
        //   this.serverErrorMessages = err.error.message;
      }
    );
    this.loginForm.reset();
  }
  // On Forgot password link click
  onForgotPassword() {
    this.router.navigate(['forgotPassword'], { relativeTo: this.route.parent });
  }
  // On registration link click
  onRegister() {
    this.router.navigate(['registerPage'], { relativeTo: this.route.parent });
  }

  // Social logins
  facebooklogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData) => {
      this.user = userData;
      console.log(this.user);
      this.abc['email'] = this.user.email;
      this.abc['password'] = this.user.id;
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

  googlelogin() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
      this.user = userData;
      console.log(this.user);
      this.abc['email'] = this.user.email;
      this.abc['password'] = this.user.id;
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

  linkedinlogin() {
    this.socialAuthService.signIn(LinkedinLoginProvider.PROVIDER_ID).then((userData) => {
      this.user = userData;
      console.log(this.user);
      this.abc['email'] = this.user.email;
      this.abc['password'] = this.user.id;
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