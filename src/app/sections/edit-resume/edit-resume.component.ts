import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { GlobalService } from '../../shared/global.service';
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Component({
  selector: 'app-edit-resume',
  templateUrl: './edit-resume.component.html',
  styleUrls: ['./edit-resume.component.scss']
})


export class EditResumeComponent implements OnInit {
  framePath;
  userSlug;
  resumeSlug;
  resumeId;
  userName;

  showLoadingIframe;
  constructor(public userService: UserService, public globalService: GlobalService, private sanitizer: DomSanitizer, public router: Router) { 
    console.log("constructor got called!!!");
    this.resumeId = localStorage.getItem('resumeId');
    this.userName = localStorage.getItem('userName');

    console.log("ngOnInit function called userName" , this.userName)
    console.log("ngOnInit function called" , typeof(this.resumeId))
    this.userSlug = this.userName;
    this.resumeSlug = this.resumeId;
    // this.framePath = "../" + this.userSlug + "/" + this.resumeSlug + '?t=' + new Date().getTime();
    this.framePath = "http://localhost:3000/api/renderTemplate/" + this.userSlug + "/" + this.resumeSlug + '?t=' + new Date().getTime();
  

    // this.framePath = "https://stylingcv.com/";


    // this.framePath = "../shaikh_shaikh/5c7f92a2893b115293e8a876"+ '?t=' + new Date().getTime();
    console.log("framePath " , this.framePath)

    this.globalService.changeTemplateWatch.subscribe(value => {
      setTimeout (() => {
        
        this.showLoadingIframe = true;
      }, 10)

      setTimeout (() => {
        this.framePath = "http://localhost:3000/api/renderTemplate/" + this.userSlug + "/" + this.resumeSlug + '?t=' + new Date().getTime();
        this.showLoadingIframe = false;
      }, 2000)
      
      
      //this.ngOnInit();
    })
  }

  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  

  ngOnInit() {
    this.showLoadingIframe = false;
    console.log("ngOnInit getting called edit resume 1")
    // this.router.routerState.root.queryParams.subscribe(params => {
    //   // this.router.queryParams.subscribe(params => {
    //   let id = params["user_id"];
    //   console.log("user_id ", id)

    // });

   

      // this.userService.renderTemplate(this.userSlug ,this.resumeSlug).subscribe((res) => {
      //     console.log('res',res);
      //     // console.log(res['data'][0].sections);
      //     // this.sections = res['data'][0].sections;
      // });
  }

  download() {
    console.log("download button pressed")
  }
  // downloadA4(){
  //   console.log("download A4 button pressed")
  // }

}

@Pipe({ name: 'safe' })

export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
