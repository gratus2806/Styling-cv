import { Component, OnInit ,Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router,ActivatedRoute ,NavigationExtras  } from "@angular/router";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../shared/user.service';
import { Resumes } from 'app/shared/resume.model';
import { WorkExperienceComponent,FormBuilder } from '../../app/sections/work-experience/work-experience.component'; 

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  providers: [WorkExperienceComponent,FormBuilder] // exp

})
export class UserDashboardComponent implements OnInit {
  userDetails;
  data = {};
  readonly USER_CREATE_RESUME_LIMIT = 2;
  readonly OPS_CREATE_RESUME_LIMIT = 10;
  public dashboardItems:Array<Object> = [
  
  ];
  public functionalityArray:Array<Object> = [
    {id: 1, name: 'Accounting/Auditin'},
    {id: 2, name: 'Administrative'},
    {id: 3, name: 'Advertising'},
    {id: 4, name: 'Art/Creative'},
    {id: 5, name: 'Business Development'},
    {id: 6, name: 'Consulting'},
    {id: 7, name: 'Customer Service'},
    {id: 8, name: 'Education'},
    {id: 9, name: 'Engineering'},
    {id: 10, name: 'Health Care'},
    {id: 11, name: 'Human Resources'},
    {id: 12, name: 'Information Technology'},
    {id: 13, name: 'Legal'},
    {id: 14, name: 'Management'},
    {id: 15, name: 'Manufacturing'},
    {id: 16, name: 'Marketing'},
    {id: 17, name: 'Production'},
    {id: 18, name: 'Project Management'},
    {id: 19, name: 'PR'},
    {id: 20, name: 'Sales'},
    {id: 21, name: 'Science'},
    {id: 22, name: 'Writing/Editing'},
    {id: 23, name: 'Other...'},


  ];

  showDashboardContent1: Boolean = true;
  showDashboardContent2: Boolean = true;
  showDashboardContent3: Boolean = true;
  showDashboardContent4: Boolean = true;
  showDashboardContent5: Boolean = true;
  showDashboardContent6: Boolean = true;
  showCoverLetterContent: Boolean = true;
  showCoverLetterLanguage: Boolean = true;

  // 03.05 jupiter
  public templates: any;
  
  constructor(public userService: UserService,
        private router: Router,  public route: ActivatedRoute,
        private modalService: NgbModal,public translate: TranslateService,
        private app: WorkExperienceComponent) { 
  }

  

  ngOnInit() {

    this.dashboardItems=
    [
      {
        Dashboard:'Dashboard',
        CreateCoverLetter:'Create Cover Letter',
        CreateResume:'Create Resume',
        // HI:'HI',
        MyDocument: 'My Document',
        Name:'Name',
        Template: 'Template',
        CreatedDate: 'Created Date',
        YourJobFunctionality: 'Your Job Functionality',
        Awellcomposedresumecan: 'A well-composed resume can',
        literallychange:'literally change', 
        ResumeName:'Resume Name:',
        EnterResumeName:'Enter Resume Name',
        LetsStart:'Lets Start',
        name1:'Select text direction (Resume language)',
        name2:'You can change the template at any time without having to rewrite the content',
        ExperienceLevel:'Experience Level',
        StudentJunior:' Student / Junior',
        Senior:'Senior',
        Executive:'Executive',
       name3:'0-2',
       Years:'Years',
       name4:'  2-6 ',
       name5:' +6',
       template1:'template 1',
       template2:'template 2',
       ResumeMarketing:'ex: Resume-Marketing',
       Resumelanguage:'Resume language',
       Selecttextdirection:'Select text direction',
       CoverLetterName:'Cover Letter Name:',
     }
    ];

    // get templates
    this.getTemplates();

    this.refreshResumeList();

    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];

        this.userService.getResumeList().subscribe((res) => {
          this.userService.resume = res as Resumes[];
          console.log("this.userService.resume " , this.userService.resume.length);
          if(this.userService.resume.length == 0){
            this.data ['userId'] = this.userDetails._id;
            this.showDashboardContent1 = false;
            this.showDashboardContent2 = false;
            // this.showDashboardContent3 = true;
            // this.showDashboardContent4 = true;
          }
          
        });
      },
      err => { 
        console.log(err);
        
      }
    );
  }

  getTemplates(){
    this.userService.getTemplates().subscribe((res) => {
      this.templates = res;
      console.log(res);
      
    });
  }

  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

  refreshResumeList() {
    console.log("refreshResumeList function called")
    this.userService.getResumeList().subscribe((res) => {
      this.userService.resume = res as Resumes[];
      console.log("this.userService.resume " ,this.userService.resume)
    });
  }

  onDelete(resume : Resumes) {
    const modalRef = this.modalService.open(NgbdModalResumeDeleteContent);
    // modalRef.componentInstance.meta = "abc";
    modalRef.componentInstance.data = resume;
  }

  onClone(resume : any) {
    console.log(resume)
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.meta = resume.meta['name']+"-clone";
    modalRef.componentInstance.data = resume;
  }

  add(resume : any,type) {
    var userMeta = this.userDetails.meta;
    if(userMeta.role == "USER" && this.userService.resume.length > this.USER_CREATE_RESUME_LIMIT){
      alert("You are only allowed to create "+this.USER_CREATE_RESUME_LIMIT+" resumes.");
      return;
    }else if(userMeta.role == "OPS" && this.userService.resume.length > this.OPS_CREATE_RESUME_LIMIT){
      alert("You are only allowed to create "+this.OPS_CREATE_RESUME_LIMIT+" resumes.");
      return;
    }
    
    this.data ['userId'] = resume._id;
    this.data['firstName'] = resume.firstName;
    this.data['lastName'] = resume.lastName;
    this.data['email'] = resume.email;
    this.data ['type'] = type;
    if(type == "Resume"){
      this.showDashboardContent1 = false;
      this.showDashboardContent2 = false;
      this.showCoverLetterContent = true; // dont show cover letter for resume
    }else if(type == "CoverLetter"){
      this.showCoverLetterContent = false; // show cover ltr
      this.showDashboardContent1 = false; // hide btns
      this.showCoverLetterLanguage= true; // hide language 
    }else{
      this.showDashboardContent1 = false;
      this.showDashboardContent3 = false;
    }
  }

  fucntionalityfucntion(value ){
    console.log("value",value)
    console.log("this.data", this.data)
    if(this.data ['firstName'] == undefined){
      this.userService.getUserProfile().subscribe(
        res => {
          // this.userDetails = res['user'];
          console.log(res['user'])
          this.data['firstName'] = res['user'].firstName;
          this.data['lastName'] = res['user'].lastName;
          this.data['email'] = res['user'].email;
          this.data ['type'] = "Resume";
        },
        err => { 
          console.log(err);
          
        }
      );
      
    }

    this.showDashboardContent2 = true;
    this.showDashboardContent3 = false;
  }

  next(form : NgForm){
    console.log("next",form.value);
    this.data ['name'] = form.value.meta;
    this.showDashboardContent3 = true;
    this.showDashboardContent4 = false; // show resume language selection
    
  }
  nextCvrLtr(form: NgForm){
    this.data['name'] = form.value.meta;
    this.showCoverLetterContent = true; // hide letter content from UI
    this.showCoverLetterLanguage = false; //show language selection for cover letter

  }

  language(language_resume){
    console.log("language", language_resume);
    this.data ['language'] = language_resume;
    this.showDashboardContent4 = true;
    this.showDashboardContent5 = false; // show template selection page
  }
  
  cvrLtrlanguage(language_resume){
    this.data ['language'] = language_resume;
    this.showCoverLetterLanguage = true; // hide lang selection after language is selected
    this.showDashboardContent5 = true; // show template selection page
  }

  template(value){
    console.log("Till now Data-->", this.data);
    this.data ['template'] = value;

    if(this.data['type'] == "Resume"){
      this.showDashboardContent5 = true;
      this.showDashboardContent6 = false;      
    }else{
      console.log("IN ELSE", this.data['type'])
      this.userService.resumeSave(this.data).subscribe((res) => {
        console.log("res " , res)
  
    localStorage.setItem('resumeId', res["user"]._id);
    
    this.router.navigate(['/cv/',res["user"]._id,'personal-info'], { relativeTo: this.route });
      });
    }
  }

  experience (value){
    this.data ['contentTemplate'] = value;
    console.log(this.data);
    this.userService.resumeSave(this.data).subscribe((res) => {
      localStorage.setItem('resumeId', res["user"]._id);
      this.router.navigate(['/cv/',res["user"]._id,'personal-info'], { relativeTo: this.route });
    });
  }

  onEdit(id){
    // console.log("this.userService " , JSON.stringify(this.userService))
    console.log("this.userDetails.permalinkSlug " , this.userDetails.permalinkSlug)

    console.log("onEdit", id._id)
  localStorage.setItem('resumeId', id._id);
  localStorage.setItem('userName', this.userDetails.permalinkSlug);

  // this.router.navigate(['/personal-info']);
  this.router.navigate(['/cv/',id._id,'personal-info'], { relativeTo: this.route });
  // this.router.navigate(['/cv/',id._id,''], { relativeTo: this.route });

// this.router.navigate(['/personal-info'], navigationExtras);

  }

  onButtonClick(content){
    this.app.openModal();
    // this.app.onChangeIcon(content)
    //     // let class1Instance = new SidebarComponent(this.router, this.route, this.translate, this.userService, this.modalService, this.activeModal);
    //   this.app.modalService.open(content, { size: 'lg' })
      // this.modalService.open(content, { size: 'lg' });
  }


}

// modeal clone  // 

@Component({
  selector: 'app-user-dashboard',
  template: `
  <div class="modal-header">
  <h4 class="modal-title">
  Copy Your Resume</h4>
  <button aria-label="Close" (click)="activeModal.dismiss('Cross click')" class="close" type="button">
  <span aria-hidden="true">×</span>
  </button></div>
  <form #cloneForm="ngForm" (ngSubmit)="cloneForm.valid && onSubmit(cloneForm,data)">
  <div class="modal-body">
  
   
  <label _ngcontent-c11="" for="meta">Resume Name</label>
  <div  class="input-group">
  <input   class="form-control" name="meta"  [(ngModel)]="meta" placeholder="Enter full name" required type="text"></div>
 
  </div>
 
  <div class="modal-footer">
  <button class="btn btn-primary btn-raised" type="submit" [disabled]="!cloneForm.valid">
  Copy
  </button>
  </div>
  </form>




 
  `
})

export class NgbdModalContent  {
  @Input() meta;
  @Input() data;
  
  // @Input() refreshResumeList;

  onSubmit(form : NgForm,data){
    console.log(data)
    var userId = data.userId
    var name = form.value.meta;
    var contentTemplate = data.meta['defaultTemplate'];
    var sections = data.sections;
    var type = data.meta['type'];
    var language = data.meta['ResumeLanguage'];
    var aboutSection = data.meta['aboutSection'];
    var email  = data.meta.email;
  
    // console.log(aboutSection)
    data = {};
    data['userId'] = userId;
    data['firstName'] =aboutSection.firstName;
    data['lastName'] = aboutSection.lastName;
    data['email'] = email
    data['name'] = name;
    data['contentTemplate'] = sections
    data['type'] = type;
    data['language'] = language; 
    console.log(data);

    this.userService.resumeSave(data).subscribe((res) => {
      this.userService.getResumeList().subscribe((res) => {
        this.userService.resume = res as Resumes[];
        this.activeModal.close();
      });
    });
    
  }
  
  constructor(public activeModal: NgbActiveModal,private userService: UserService) {}
}

//   modal delete // 

@Component({
  selector: 'app-user-dashboard',
  template: `
    <div class="modal-header">
      <h2 style="color:black">Remove Resume</h2>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <i class="ft-x font-medium-3"></i>
      </button>
    </div>
    <form #cloneForm="ngForm" (ngSubmit)="cloneForm.valid && onSubmitDelete(data)">
      <div class="modal-body">
        <p>Are You Sure You want to delete</p>
          <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Cancel</button>
          <button class="btn btn-custom right" type="submit" [disabled]="!cloneForm.valid">OK</button>
      </div>
    </form>
    
  `
})

export class NgbdModalResumeDeleteContent  {
  @Input() meta;
  @Input() data;

  onSubmitDelete(data){
    this.userService.deleteResume(data._id).subscribe((res) => {
      this.userService.getResumeList().subscribe((res) => {
        this.userService.resume = res as Resumes[];
        this.activeModal.close();
      }); 
        // this.resetForm(form);
    });
    // console.log("hello")
  }
  

  constructor(public activeModal: NgbActiveModal,private userService: UserService,private router: Router) {}
  
}

//   create modal   //   ///  below code is extra will be deleted later just for observation  ////

@Component({
  selector: 'app-user-dashboard',
  template: `
    <div class="modal-header">

      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <i class="ft-x font-medium-3"></i>
      </button>
    </div>
    <div *ngIf="showMainContent1">
    <form #cloneForm="ngForm" (ngSubmit)="cloneForm.valid && ShowHideButton1(cloneForm,data)">
      <div class="modal-body">
        <p>Resume  Name</p>
        <div class = "col-sm-6">
        <input type="text"  name="meta"  [(ngModel)]="meta" placeholder="Enter full name" required>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-custom right" type="submit" [disabled]="!cloneForm.valid">Next</button>
      </div>
    </form>
    </div>
    <div *ngIf="!showMainContent2">
    <form #cloneForm="ngForm" (ngSubmit)="cloneForm.valid && ShowHideButton2(cloneForm,data)">
    <div class="modal-body">
      <p>Template Type</p>
      <div class = "col-sm-6">
      <input type="text"  name="sections"  [(ngModel)]="sections" placeholder="Enter full name" required>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-custom right" type="submit" [disabled]="!cloneForm.valid">Submit</button>
    </div>
  </form>
    </div>
  `
})
 
export class NgbdModalResumeContent  {
  @Input() meta;
  @Input() array;

  showMainContent1: Boolean = true;
  showMainContent2: Boolean = true;
  


  ShowHideButton2(form : NgForm,data) {
    data['sections'] = form.value.sections;
    console.log(data)
    this.userService.resumeSave(data).subscribe((res) => {
      this.activeModal.close();
      this.router.navigate(['/dashboard']);
    });
   
  }
  constructor(public activeModal: NgbActiveModal,private userService: UserService,private router: Router) {}
  
}



