import { Component, OnInit, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../shared/user.service';
import { count } from '@swimlane/ngx-charts';
import { Router ,NavigationExtras  } from "@angular/router";

var fireRefreshEventOnWindow = function () { 
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent('resize', true, false);
    window.dispatchEvent(evt);
}; 

@Component({
    selector: 'app-full-layout', 
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.scss']
})

export class FullLayoutComponent implements OnInit {

    options = {
        direction: 'ltr'
    }; 

    textDir; // direction according to language
    constructor(private elementRef: ElementRef, 
        public userService : UserService, 
        private router: Router, 
        public translate:TranslateService,
        private renderer: Renderer2) {
            
         }

    ngOnInit() {
        if(localStorage.getItem('currentTab') === null){
            this.currentTab = -1;
        } else {
            this.currentTab = localStorage.getItem('currentTab');
        }
        let language = localStorage.getItem('locale');
        this.setDirection(language);
        this.translate.use(language);
        if(language == "ar"){
            this.renderer.addClass(document.body, "langAR");
        }
        //if(localStorage.getItem('current'))
        // //sidebar toggle event listner
        // this.elementRef.nativeElement.querySelector('#sidebarToggle')
        //     .addEventListener('click', this.onClick.bind(this));
        // //customizer events
        // this.elementRef.nativeElement.querySelector('#cz-compact-menu')
        //     .addEventListener('click', this.onClick.bind(this));
        // this.elementRef.nativeElement.querySelector('#cz-sidebar-width')
        //     .addEventListener('click', this.onClick.bind(this));

        
    }

    setDirection(language:any){
        if(language =='ar'){
            this.textDir = 'rtl';
        }else{
            this.textDir = 'ltr';
        }
        //this.translate.use(language);
    }
    onClick(event) {
        //initialize window resizer event on sidebar toggle click event
        setTimeout(() => { fireRefreshEventOnWindow() }, 300);
    }

    getOptions($event): void {
        console.log($event);
        
        this.options = $event;
    }

    id;
    resumeIdArray;
    sectionUniqueId;
    sectionname;
    sectionArray;
    currentTab:any = 0;
    isTabPresent: Boolean = false;
    
    nextSection(){

        console.log("currentTab", this.currentTab);
        var currentPath = window.location.pathname.substring(1);
        var onTab =  window.location.pathname;
        if (currentPath == 'work-experience'){
            currentPath = 'Work Experience';
        }
        this.id = localStorage.getItem('resumeId');
        
        this.userService.getResume(this.id).subscribe((res) => {
        // this.resumeId["id"] = res['data'][0]._id;
        // console.log(this.resumeId)
        this.resumeIdArray = res['data'][0];
        var data = res['data'][0].sections;
        this.currentTab  = parseInt(localStorage.getItem('currentTab')) + 1;
        localStorage.setItem('currentTab', this.currentTab);
        var nextSection = data[this.currentTab];
        this.router.navigate([nextSection.path]);
        // this.currentTab += 1;
        // data.forEach((element, key) => {
        //     if(element.path == onTab && data.length != key+1){
        //         this.isTabPresent = true;
        //         this.currentTab = key+1;
        //         console.log("To be redirected to-->", data[key+1].path);
        //         this.router.navigate([data[key+1].path]);
        //     }else{
        //     }
        // });
        
        // if(!this.isTabPresent){
        //     this.currentTab = 0;
        //     this.isTabPresent = false;
        //     // console.log("YEAH its not present", this.isTabPresent)
        //     this.router.navigate([data[this.currentTab].path]);
        // }else{
        //     // this.isTabPresent = false;
        // }
        return;
    
        if(nextSection != undefined){
            console.log("data.length", data.length, "currentTab", this.currentTab)
            this.currentTab += 1;
            this.router.navigate([nextSection.path]);
        }

        return;
        
        // for (var i = 0; i < data.length; i++){
        //     console.log("for data " , data[i].name);
        // } 
        var counter = 0;
        data.forEach(element => {
            counter = counter + 1;
        //   console.log(element)
          console.log(element.name)
            if( element.name == currentPath){
                console.log("match found")
                console.log("counter " , counter)
                var nextSection = data[counter]
                console.log("nextSection name" , nextSection.name)
                if( nextSection.name == "Courses"){
                    this.router.navigate(['/courses']);
                }
            }
        //   if(element['name'] == "Work Experience"  || element['name'] ==  "الخبرات السابقة"){

        //     this.sectionUniqueId = element['ids'];
        //     var  workexperince  = element;
        //     // this.sectionArray = workexperince;
        //     // this.WorkExperinceArray = workexperince.subsections;

        //   }
        });

        // data.forEach(element => {
        //   // console.log(element)
        //   if(element['name'] == "Work Experience"  || element['name'] ==  "الخبرات السابقة"){

        //     this.sectionUniqueId = element['ids'];
        //     var  workexperince  = element;
        //     // this.sectionArray = workexperince;
        //     // this.WorkExperinceArray = workexperince.subsections;

        //   }
        // });
        
      });
    }

    languageChangedHandler(language:any){
        this.renderer.removeClass(document.body, 'classAR');
        if(language =='ar'){
            this.textDir = 'rtl';
            this.renderer.addClass(document.body, 'classAR');
        }else{
            this.textDir = 'ltr';
        }
        //this.translate.use(language);
    }

}
