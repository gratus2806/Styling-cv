import { Component, OnInit ,Input,OnDestroy } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute ,Params,NavigationExtras} from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../user.service';
import { findIndex } from 'rxjs/operators'
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { SectionsComponent } from 'app/sections/sections.component';
import { GlobalService } from '../global.service';

declare var $: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})

export class SidebarComponent implements OnInit,OnDestroy {
    public menuItems = [];
    public sectiondynamicArray : any[];
    public sections = []  ;
    public sub: any;
    public id :any;
    public userSlug: any;
    public resumeSlug: any;
    public resumeIdArray : any;
    public resumeLanguage : any;
    
    message: any;
    subscription: Subscription;
    userdetails = {firstName: '', lastName:'', role: ''};
    textDir: any;
    resumeMeta;
    resumeData;

    personalInfo = {firstName: '', lastName: ''};

    constructor(public router: Router,
        public global: GlobalService,
        public route: ActivatedRoute, public translate: TranslateService,public userService : UserService,public modalService: NgbModal) {
            this.subscription = this.userService.getMessage().subscribe(message => { this.message = message; 
                this.resumeIdArray = this.message
                
                this.id = localStorage.getItem('resumeId');
                this.menuItems = ROUTES.filter(menuItem => menuItem.name == "Personal Info");
                this.menuItems[0].path = "/cv/"+this.id+"/personal-info";
                
                this.message.sections.forEach(element => {
                    var index = ROUTES.findIndex(x => x.type.toString().toLowerCase() === element.type.toString().toLowerCase());
                    
                    element.path = this.getPath(element,index); 

                    if(element.sectionname != undefined){
                        ROUTES[index].sectionname = element.sectionname;
                    }
                    element.sectionname = ROUTES[index].sectionname;
                    this.menuItems.push(element); 
                });
                
                //this.menuItems = this.message.sections
            });
            this.global.userDetailWatch.subscribe(value => {
                this.personalInfo.firstName = value['firstName'];
                this.personalInfo.lastName = value['lastName'];

                this.userdetails.firstName = value['firstName'];
                this.userdetails.lastName = value['lastName']; 
                this.userdetails.role = value['meta']['role'];
            })
 
            this.global.personalInfoWatch.subscribe(value => {
                this.personalInfo.firstName = value['aboutSection'].firstName;
                this.personalInfo.lastName = value['aboutSection'].lastName;
                
            });
            this.global.languageChangeWatch.subscribe(value => {
                if(value =='ar'){ 
                    this.textDir = 'rtl';
                }else{
                    this.textDir = 'ltr';
                }
            });

            this.id = localStorage.getItem('resumeId');
            this.userService.getResume(this.id).subscribe((res) => {
            this.resumeData = res['data'][0];
            this.resumeMeta = res['data'][0].meta;
            console.log("Sidebar resumeMeta data ", this.resumeMeta.type)
          });
    }
    func : any;

    ngOnInit() {
        
        var language = localStorage.getItem('locale');
        if(language =='ar'){
            this.textDir = 'rtl';
        }else{
            this.textDir = 'ltr';
        }

        this.id = localStorage.getItem('resumeId');
        
        $.getScript('./assets/js/app-sidebar.js');
        
        this.updateLinks();
        
        
    }

    updateLinks = () => {
        this.id = localStorage.getItem('resumeId');
        this.menuItems = ROUTES.filter(menuItem => menuItem.name == "Personal Info");
        this.menuItems[0].path = "/cv/"+this.id+"/personal-info";
        //  console.log(this.menuItems);
        this.sub = this.route.queryParams.subscribe(params => {
            this.id = params["property_id"];
            this.userSlug = params["userSlug"];
            this.resumeSlug = params["property_id"];
        });
        this.id = localStorage.getItem('resumeId');
        
        this.userService.getResume(this.id).subscribe((res) => {
            
            this.sections = res['data'][0].sections;
            this.resumeIdArray = res['data'][0];
            
            this.resumeLanguage = res['data'][0].meta.ResumeLanguage
            this.sections.forEach(element => {
                
                var index = ROUTES.findIndex(x => x.type.toString().toLowerCase() === element.type.toString().toLowerCase());
                
                element.path=this.getPath(element,index);
                if(element.sectionname){
                    ROUTES[index].sectionname = element.sectionname;
                }else{
                    ROUTES[index].sectionname = element.name;  
                }
                
                element.sectionname = ROUTES[index].sectionname;
               this.menuItems.push(element); 
            });
            
            this.userService.updateresumegeneric(this.id,this.resumeIdArray).subscribe((res : any) => {

            });
            
        });
    }

    testing(){
        // console.log("testing func called")
        this.ngOnInit();
    }
    getPath(element,index){
        return  "/cv/" + this.id + ROUTES[index].path+"/"+element.ids  
        window.location.reload(); 

    }

    new_section(){
        
        // console.log(this.resumeIdArray)
        const modalRef = this.modalService.open(NgbdModalAddNewSection);
        modalRef.componentInstance.language = this.resumeLanguage;
        modalRef.componentInstance.data = this.id
        modalRef.componentInstance.resumeIdArray = this.resumeIdArray
    }

    ngOnDestroy() {
        // console.log("destroy");
        
        // this.subscription.unsubscribe();
        this.userService.hero = this.id
     }


    //NGX Wizard - skip url change
    // ngxWizardFunction(path: string) {
    //     if (path.indexOf('forms/ngx') !== -1)
    //         this.router.navigate(['forms/ngx/wizard'], { skipLocationChange: false });
    // }
}

@Component({
    selector: 'app-sidebar',
    template: `
   
<div class="modal-header">
<h2 style="color:black">Add New Section</h2>
<button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"> <i class="ft-x font-medium-3"></i> </button>
</div>
<div class="modal-body">
<div *ngIf="language == 'Arabic'; else templateName">
  <div class="d-flex justify-content-between flex-wrap">
    <div class="col-12 col-md-6 col-lg-6"  *ngFor="let ArabicSectionArray of ArabicSectionArray">
      <div class="d-flex border border-primary m-1 p-2 btn  align-items-center bg-grey bg-lighten-3"  (click)="fucntionalityfucntion(ArabicSectionArray,data,resumeIdArray) "> <i [ngClass]="[ArabicSectionArray.icon]" class="mr-1"></i> <span > {{ArabicSectionArray.name}} </span> </div>
    </div>
  </div>
</div>
<ng-template #templateName>
  <div class="d-flex justify-content-between flex-wrap">
    <div class="col-12 col-md-6 col-lg-6" *ngFor="let EnglishSectionArray of EnglishSectionArray">
      <div class="d-flex border border-primary m-1 p-2 btn  align-items-center bg-grey bg-lighten-3" (click)="fucntionalityfucntion(EnglishSectionArray,data,resumeIdArray) "> <i [ngClass]="[EnglishSectionArray.icon]" class="mr-1"></i> <span > {{EnglishSectionArray.name}} </span> </div>
    </div>
  </div>
</ng-template>
</div>

    `
}) 

export class NgbdModalAddNewSection  {
@Input() meta;
@Input() data;

public menuItems = [];
public sectiondynamicArray : any[];
public sections = []  ;
public sub: any;
public id :any;


public EnglishSectionArray = [
        {
            name : "Work Experience",
            sectionname : "Work Experience",
            type : "section-work",
            icon : "fa-building",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "Education", 
            sectionname : "Education",
            type : "section-education",
            icon : "fa-graduation-cap",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "Languages",
            type : "section-languages",
            icon : "fa-comments",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "Skills",
            type : "section-skillset",
            icon : "fa-stats-bars",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "Empty Space",
            type : "section-empty",
            icon : "fa-arrow-resize8",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "Awards",
            type : "section-awards",
            icon : "fa-trophy",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "Certifications",
            type : "section-certifications",
            icon : "fa-android",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "Cources",
            type : "section-courses",
            icon : "fa-android",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "Hobbies",
            type : "section-Hobbies",
            icon : "fa-bike",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "Interests",
            type : "section-interests",
            icon : "fa-price-tags",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "Clients Logos",
            type : "section-logos",
            icon : "fa-images",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
         },
         {
            name : "Software Skills",
            type : "section-software",
            icon : "fa-android",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],    
        }, 
        {
            name : "Free Text",
            type : "section-text-inside",
            icon : "fa-file-text",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "References",
            type : "section-references",
            icon : "fa-users",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "World Map",
            type : "section-world-map",
            icon : "fa-map",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "Portfolio",
            type : "section-portfolio",
            icon : "fa-image",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "Publications",
            type : "section-publications",
            icon : "fa-image",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        }
    ]

    public ArabicSectionArray = [
        {
            name : "الخبرات السابقة",
            sectionname : "Work Experience",
            type : "section-work",
            icon : "fa-building",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "التعليم", 
            sectionname : "Education",
            type : "section-education",
            icon : "fa-graduation-cap",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "اللغات",
            type : "section-languages",
            icon : "fa-comments",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "المهارات",
            type : "section-skillset",
            icon : "fa-stats-bars",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "مساحة فارغة",
            type : "section-empty",
            icon : "fa-arrow-resize8",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "الجوائز والتقديرات",
            type : "section-awards",
            icon : "fa-trophy",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "الشهادات",
            type : "section-certifications",
            icon : "fa-android",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "الدورات",
            type : "section-courses",
            icon : "fa fa-windows",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "الهوايات",
            type : "section-Hobbies",
            icon : "fa-bike",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "الإهتمامات",
            type : "section-interests",
            icon : "fa-price-tags",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "شعارات",
            type : "section-logos",
            icon : "fa-images",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
         },
         {
            name : "البرامج",
            type : "section-software",
            icon : "fa-android",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],    
        },
        {
            name : "نص حر",
            type : "section-text-inside",
            icon : "fa-file-text",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "المعرفون",
            type : "section-references",
            icon : "fa-users",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "خريطة العالم",
            type : "section-world-map",
            icon : "fa-map",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : "محفظة الصور - المشاريع",
            type : "section-portfolio",
            icon : "fa-image",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        },
        {
            name : " المنشورات والمقالات",
            type : "section-publications",
            icon : "fa-image",
            rightChannel : true,
            ids : Math.floor(100000000 + Math.random() * 900000000),
            subsections: [],
        }
    ]


fucntionalityfucntion(array,id,resumeIdArray){
//    console.log("fucntionalityfucntion called")
//     console.log(array)

    // var data = {
    //     "sections" : array
    // }
    // console.log(resumeIdArray.sections)
    resumeIdArray.sections.push(array);
    // console.log(resumeIdArray)
    this.userService.updateresumegenericsubject(id,resumeIdArray).subscribe((res : any) => {
        // let class1Instance = new SidebarComponent(this.router, this.route, this.translate, this.userService, this.modalService); 
        //   let class1Instance = new SidebarComponent(this.router, this.route, this.translate, this.userService, this.modalService, this.activeModal); 
        // class1Instance.ngOnInit(); 
        this.activeModal.close();
        let last:any = res.doc.sections[res.doc.sections.length-1];
        // console.log("last element" ,last);
        this.router.navigate([last.path]);
      });
      
    // this.userService.updateresume(id,data).subscribe((res : any) => {
    //     console.log("updateresume", res.doc._id);
    //    this.id = res.doc._id;
    //     // let class1Instance = new SidebarComponent(this.router, this.route, this.translate, this.userService, this.modalService);
    //     // // // class1Instance.testing();
    //     // class1Instance.ngOnInit();
        
        

    //   });
    
  }

// @Input() refreshResumeList;



// constructor(public activeModal: NgbActiveModal,private userService: UserService) {}
constructor(public router: Router,public activeModal: NgbActiveModal,
    public route: ActivatedRoute, public translate: TranslateService,public userService : UserService,public modalService: NgbModal) {
}
}
