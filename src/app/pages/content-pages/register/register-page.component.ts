import { Component, ViewChild, OnInit } from '@angular/core';
// import { UserService } from 'app/shared/user.service';
import { NgForm } from '@angular/forms';
import {ActivatedRoute, Router, Params } from "@angular/router";
import { UserService } from '../../../shared/user.service'
import { SocialUser, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LinkedinLoginProvider, AuthService } from 'ng-social-login-module';
import { Map } from 'core-js';
import { Jsonp } from '@angular/http';
import { User } from  '../../../shared/user.model';


@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss']
})

export class RegisterPageComponent {
    @ViewChild('f') registerForm: NgForm;
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    showSucessMessage: boolean;
    serverErrorMessages: string;
    abc = {}; //used in
    public user: any = SocialUser;

    constructor(public userService: UserService, private socialAuthService: AuthService, public router: Router, private route : ActivatedRoute) { 
      this.route.queryParams.subscribe((params: Params) => {
        console.log(params['email'])

                // console.log(map)
        // console.log(map['firstName']);
        // console.log(map.keys.values['email'])
        this.getLoginDetail(params['email'],params['password'],params['firstName'],params['lastName']);
    })
    }

    //  On submit click, reset field value
    onSubmit() {
        console.log("this.registerForm.value ", this.registerForm.value)
        this.userService.postUser(this.registerForm.value).subscribe(
            res => {
                console.log("registration done")
              this.userService.login(this.registerForm.value).subscribe(
                res => {
                  this.userService.setToken(res['token']);
                  this.router.navigateByUrl('/dashboard');
                },
                err => {
                  this.serverErrorMessages = err.error.message;
                }
              );
              // this.showSucessMessage = true;
              // setTimeout(() => this.showSucessMessage = false, 4000);
              // this.resetForm(form);
            },
            err => {
              if (err.status === 422) {
                this.serverErrorMessages = err.error.join('<br/>');
              }
              else
                this.serverErrorMessages = 'Something went wrong.Please contact admin.';
            }
          );
        // this.registerForm.reset();
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
      linkedinlogin(): void {
        console.log("linkedinlogin function called");
        this.userService.linkedinlogin().subscribe(
          res => {
            //  this.abc =res as User[]; 
            console.log("response came")
             console.log(res);
            // this.userService.setToken(res['token']);
            // this.router.navigateByUrl('/dashboard');
            // this.showSucessMessage = true;
            // setTimeout(() => this.showSucessMessage = false, 4000);
          },
          err => {
            console.log(err)
            // if (err.status === 422) {
            //   this.serverErrorMessages = err.error.join('<br/>');
            // }
            // else
            //   this.serverErrorMessages = 'Something went wrong.Please contact admin.';
          }
        ); 
        // this.socialAuthService.signIn(LinkedinLoginProvider.PROVIDER_ID).then((userData) => {
        //   this.user = userData;
        //   console.log(this.user);
        //   // this.abc['email']  = this.user.email ;
        //   let x = this.user.name.split(" ")
        //   this.abc['firstName'] = x[0];
        //   this.abc['lastName'] = x[1];
        //   this.abc['password'] = this.user.token;
        //   this.user = {};
        //   this.user = this.abc;
        //   console.log(this.user);
        //   this.userService.postUser(this.user).subscribe(
        //     res => {
        //       this.showSucessMessage = true;
        //       setTimeout(() => this.showSucessMessage = false, 4000);
        //     },
        //     err => {
        //       if (err.status === 422) {
        //         this.serverErrorMessages = err.error.join('<br/>');
        //       }
        //       else
        //         this.serverErrorMessages = 'Something went wrong.Please contact admin.';
        //     }
        //   );
        // });
      }
      signOut(): void {
        this.socialAuthService.signOut();
      }


       getLoginDetail(param1 : String, param2 : String,param3 :String , param4 : String){
         console.log("hello u enterd")
         console.log(param1)
        if(typeof param1 !== "undefined" && typeof param1 === "string" &&
        typeof param2 !== "undefined" && typeof param2 === "string" && 
        typeof param3 !== "undefined" && typeof param3 === "string" &&
        typeof param4 !== "undefined" && typeof param4 === "string"
        ){
          this.abc ['firstName'] = param3;
          this.abc ['lastName'] = param4;
          this.abc ['email'] = param1;
          this.abc ['password'] = param2;
          console.log(this.abc)
          this.userService.login(this.abc).subscribe(
            res => {
              this.userService.setToken(res['token']);
              this.router.navigateByUrl('/dashboard');
            },
            err => {
              console.log(err)
              this.serverErrorMessages = err.error.message;
            }
          );
            // this.router.navigate['/'];
            // this.router.navigateByUrl('/dashboard');
        }
    }
}