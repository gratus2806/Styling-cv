import { Component, OnInit,EventEmitter, Renderer2  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  textDir;
  preferred_language;
  public userItems:Array<Object> = [
    
  
  ];

 

  constructor(public translate: TranslateService, 
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2) { 
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es|pt|de|ar/) ? browserLang : 'en');    
  }
 

  ngOnInit() {
    if(this.activatedRoute.snapshot.params.language){
      this.preferred_language = this.activatedRoute.snapshot.params.language;
      localStorage.setItem("locale", this.preferred_language);
      if(this.preferred_language == "ar"){
        this.renderer.addClass(document.body, "langAR");
      }
    } else {
      if(localStorage.getItem("locale") === null){
        this.preferred_language = "en";
        localStorage.setItem("locale", this.preferred_language);
      } else {
        this.preferred_language = localStorage.getItem("locale");
        if(this.preferred_language == "ar"){
          this.renderer.addClass(document.body, "langAR");
        }
      }
      
    }
    
    this.translate.use(this.preferred_language);
    
    // which langulage is selected in url
    if(this.preferred_language =='ar'){
      this.textDir = 'rtl';
    }else{
      this.textDir = 'ltr';
    }

    this.userItems=
    [
      {
        LogIn:'Log In',
        SignUp:'Sign Up'  
      }
  
    ];
    
  }

  ChangeLanguage(language: string) { 
    this.translate.use(language);
    this.preferred_language = language;
    localStorage.setItem("locale", this.preferred_language);
    this.renderer.removeClass(document.body, "langAR");
    if(language =='ar'){
      this.textDir = 'rtl';
      this.translate.use(language);
      this.renderer.addClass(document.body, "langAR");
    }else{
      this.textDir = 'ltr';
      this.translate.use(language);
    }
  }
}
