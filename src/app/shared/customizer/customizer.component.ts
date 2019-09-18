import { Component, OnInit, AfterViewChecked, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { UserService } from '../user.service';
import { GlobalService } from '../global.service';
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { URLSearchParams, Headers, Http, RequestOptions } from '@angular/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RenameSectionComponent } from '../../common_modals/rename-section/rename-section.component';

import { EditResumeRoutingModule } from 'app/sections/edit-resume/edit-resume-routing.module';

import { Options, ChangeContext } from 'ng5-slider';

let personId = 0;

class Person {
  id: number;
  constructor(public name: string) {
    this.id = personId++;
  }
}

@Component({
  selector: 'app-customizer',
  templateUrl: './customizer.component.html',
  styleUrls: ['./customizer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomizerComponent implements OnInit {



  constructor(private dragulaService: DragulaService, 
    private userService: UserService, 
    private router: Router, 
    private http: HttpClient, 
    private modalService: NgbModal,
    public global: GlobalService,
    public route: ActivatedRoute) {
      this.global.changeTemplateWatch.subscribe(value => {
        this.ngOnInit();
      })
  }

            
  colorsArray = [
    {name: "original"},
    {name: "blue"},
    {name: "greenI"},
    {name: "brownI"},
    {name: "purpleI"},
    {name: "redI"},
    {name: "blueII"},
    {name: "blueII"},
    {name: "blueII"},
    {name: "blueII"},
    {name: "blueII"},
    {name: "blueII"}
  ];

  backgroundsArray = [
  {name: "1", bg: "bg1"},
  {name: "2", bg: "bg2"},
  {name: "3", bg: "bg3"},
  {name: "4", bg: "bg4"},
  {name: "5", bg: "bg5"},
  {name: "6", bg: "bg6"},
  {name: "7", bg: "bg7"},
  {name: "8", bg: "bg8"},
  {name: "9", bg: "bg9"},
  {name: "10", bg: "bg10"},
  {name: "11", bg: "bg11"},
  {name: "12", bg: "bg12"},
  {name: "13", bg: "bg13"},
  {name: "14", bg: "bg14"}
];


  EnglishfontArray = [
    {name: "Raleway", img: "Raleway.svg"},
    {name: "Roboto", img: "Roboto.svg"},
    {name: "CormorantGaramond", img: "Cormorant Garamond.svg"},
  {name: "Lora", img: "Lora.svg"},
  {name: "Lusitana", img: "Lusitana.svg"},
  {name: "Merriweather", img: "Merriweather.svg"},
  {name: "Overpass", img: "Overpass.svg"},
  {name: "Quicksand", img: "Quicksand.svg"},
  {name: "Rokkitt", img: "Rokkitt.svg"},
  {name: "Ubuntu", img: "Ubuntu.svg"} 
  ];

  // the variable if current page is edit-resume or not.
  checkEditor:any;


  showMore = false;
  showMoreFont = false;
  public optionFonts: any = {
   
    step: 0.1,

    showTicksValues: true, 
    stepsArray: [
          {value: 0.8},
          {value: 0.9},
          {value: 1.0},
          {value: 1.1},
          {value: 1.2},
          {value: 1.3},
          {value: 1.4},
          {value: 1.5},
          {value: 1.6},
          {value: 1.7},
          {value: 1.8}
        ]
  };
 
  
  public isCollapsedBackgrounds = true;
  public isCollapsedFonts = true;
  options = {
    direction: 'ltr'
  };

  @Output() directionEvent = new EventEmitter<Object>();

  @Input() updatedResumeTemplate;
 
  resumeId;
  resumeData;
  resumeMeta;
  userName;
  scrollbarConfig;
  channelSelected;
  colorSelected;
  bgSelected;
  fontSelected;
  templateSelected;
  fontsizeSelected;

  userDetails = {role: ''};
  check_resumeLang:boolean;  // check if resume language is arabic or not
  ngOnInit() {
    console.log("customizer onit called")
    this.checkEditor = false;
    if(window.location.pathname.indexOf( "/edit-resume") > -1){
      this.checkEditor = true;
    }
    this.resumeMeta = {defaultTemplate: {name: ""}, ResumeLanguage: ""};
    /**
     * Not sure if we require this file
     * but it refreshes the screen
     */
    $.getScript('./assets/js/customizer.js');
    this.resumeId = localStorage.getItem('resumeId');

    this.userService.getResume(this.resumeId).subscribe((res) => {
      this.resumeData = res['data'][0];
      this.resumeMeta = res['data'][0].meta;
      this.check_resumeLang = this.resumeMeta.ResumeLanguage === "Arabic" ? false : true;

      this.channelSelected = this.resumeMeta.defaultTemplate.resumeColumn;
      this.colorSelected = this.resumeMeta.defaultTemplate.resumeColor;
      this.bgSelected = this.resumeMeta.defaultTemplate.resumeBg;
      this.templateSelected = this.resumeMeta.defaultTemplate.name;
      
      localStorage.setItem('selected_template', this.templateSelected);
    });

    this.userService.getUserProfile().subscribe(
      res => {
        console.log("sdfsfdss");
        console.log(res);
          this.userDetails.role = res['user']['meta']['role'];
          
      },
      err => { 
        console.log(err); 
      }
    );

  }
  ngAfterViewChecked(){
    // after checking resumeLangulage, it chooses font type.
    this.fontSelected = this.resumeMeta.defaultTemplate.headingFont;
    this.fontsizeSelected = this.resumeMeta.defaultTemplate.ResumeFontSize;
  }

  backToEditor(){
    let resume_id = localStorage.getItem("resumeId");
     this.router.navigate(['/cv/',resume_id,'personal-info'], { relativeTo: this.route });

  }
  changeResumeTemplate(){
    const modalRef = this.modalService.open(NgbdModalTemplateLists,{size: 'lg', windowClass: 'modalTemplate'});
    this.userService.getTemplates().subscribe((res) => {
      modalRef.componentInstance.templates = res; 
      modalRef.componentInstance.resumeId = this.resumeId;
      modalRef.componentInstance.templateSelected = this.templateSelected;
    });
  }

  changeTemplateEvent(){
    console.log("event Emitter");
  }
  // ngAfterViewChecked() {
  //   console.log("ngAfterViewChecked called")

  //   // setTimeout(() => {
  //   //   var wrapperDiv = document.getElementsByClassName("wrapper")[0];
  //   //   var dir = wrapperDiv.getAttribute("dir");      
  //   //   this.options.direction = dir;      
  //   // }, 3000);


  // }

  sendOptions() {   
    console.log(this.options) 
    this.directionEvent.emit(this.options);
  }

  changeResumeChannel(channel) {
    console.log("channel ", channel)
    this.channelSelected = channel;
    this.resumeMeta.defaultTemplate.resumeColumn = channel;
    let meta = {
      meta: this.resumeMeta
    }
    this.userService.updateresumegeneric(this.resumeId, meta).subscribe((res: any) => {
      this.global.emitTemplateChange(true);
      console.log("updateresumegeneric response", res)
    });
  }

  changeColour(colour) {
    console.log("this.resumeId ", this.resumeId)
    console.log("customizer resumeMeta data ", this.resumeMeta)
    console.log("colour ", colour)
    this.colorSelected = colour;
    this.resumeMeta.defaultTemplate.resumeColor = colour;
    console.log("customizer resumeMeta data ", this.resumeMeta)
    let meta = {
      meta: this.resumeMeta
    }
    this.userService.updateresumegeneric(this.resumeId, meta).subscribe((res: any) => {
      this.global.emitTemplateChange(true);
      console.log("updateresumegeneric response", res)
    });
  }

  changeBackground(background) {
    console.log("background ", background)
    console.log("this.resumeId ", this.resumeId)
    this.bgSelected = background;
    this.resumeMeta.defaultTemplate.resumeBg = background;
    console.log("customizer resumeMeta data ", this.resumeMeta)
    let meta = {
      meta: this.resumeMeta
    }
    this.userService.updateresumegeneric(this.resumeId, meta).subscribe((res: any) => {
      this.global.emitTemplateChange(true);
      console.log("updateresumegeneric response", res)
    });
  }

  changeFontFamily(fontfamily) { 
    console.log("fontfamily ", fontfamily)
    this.fontSelected = fontfamily;
    this.resumeMeta.defaultTemplate.headingFont = fontfamily;
    let meta = {
      meta: this.resumeMeta
    }
    this.userService.updateresumegeneric(this.resumeId, meta).subscribe((res: any) => {
      this.global.emitTemplateChange(true);
      console.log("updateresumegeneric response", res)
    });

  }
  changeFontSize(changeContext: ChangeContext):void{
    this.resumeMeta.defaultTemplate.ResumeFontSize = changeContext.value;
    let meta = {
      meta: this.resumeMeta
    }
    this.userService.updateresumegeneric(this.resumeId, meta).subscribe((res: any) => {
      this.global.emitTemplateChange(true);
      console.log("updateresumegeneric response", res)
    });
  }
  onUserChangeStart(changeContext: ChangeContext):void{
    this.resumeMeta.defaultTemplate.ResumeFontSize = changeContext.value;
    //this.fontsizeSelected = changeContext.value;
  }
  onUserChange(changeContext: ChangeContext):void{
    this.resumeMeta.defaultTemplate.ResumeFontSize = changeContext.value;
    //this.fontsizeSelected = changeContext.value;
  }
  data;
  id;
  headers: any;
  getData() {
    console.log("getData function called")
    let urlSearchParams = new URLSearchParams();

  }

  arrangeSections(resumeData) {
    console.log("arrangeSections function called");
     const modalRef = this.modalService.open(NgbdModalArrangeSections,{size: 'lg', windowClass: 'modalArrange'}); 
    modalRef.componentInstance.data = resumeData;

  }

  //   download(){
  //   let url = 'http://localhost:3000/api/download';

  //   this.http.get(url, options).toPromise()
  //   .then(res => {
  //       var data = res.headers.get('X-Custom-header');
  //       console.log(data);
  //       return res;
  //   })
  // }
  // }
  download() {
    console.log("download function called")
    //let urlSearchParams = new URLSearchParams();
    this.userName = localStorage.getItem('userName');
    let urlSearchParams = {
      resumeId: this.resumeId,
      pageSize: 'A4',
      userName: this.userName

    }
    this.userService.downloadResume(urlSearchParams).subscribe(data => {
        if (data) {
          let body = data;

          let contentType = 'application/pdf';
          let filename = 'MyResume.pdf';
          var linkElement = document.createElement('a');
          
          try {
            var blob = new Blob([data], { type: contentType });
            var url = window.URL.createObjectURL(blob);
            linkElement.setAttribute('href', url);
            linkElement.setAttribute("download", filename);
            var clickEvent = new MouseEvent("click", {
              "view": window,
              "bubbles": true,
              "cancelable": false
            });
            linkElement.dispatchEvent(clickEvent);
            
          } catch (ex) {
            console.log(ex);
          }
        }
      },
      error => {
        console.log(JSON.stringify(error.json()));
      }
    )
   
  }
  
}


@Component({
  selector: 'app-user-dashboard',
  template: ` 
   
  <div class="modal-header">
  <h2 style="color:black">{{'arrange sections' | translate}} </h2>
  <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"> <i class="ft-x font-medium-3"></i></button>
</div>
<form #cloneForm="ngForm">
  <div class="modal-body">
    <p innerHtml="{{'Drag and Drop' | translate}}"> </p> 
    
    <div class="row">
      <div class="col-md-12 col-lg-12">
        <div class="card p-2">
          <div class='parent'>
            <div class='drag-drop-wrapper' *ngIf="!channel_type">
              <div class='drag-drop-container' side = "left" style = "width:50%;" [dragula]="MANY_ITEMS" [(dragulaModel)]='leftresumeSections'>
                <div class="gu-mirror-stylingcv" *ngFor="let section of leftresumeSections">
                  <div class='d-flex align-items-center d-flex justify-content-between'> 
                  <i class='fa {{section.icon}} mr-1'></i>
                   <span class='flex-grow-1'> {{section.name}} </span>
                  <span class='hideOnDrag'> 
                    <i class='ft-edit p-1' (click)="showRenamePopup(section.ids)"  placement='top' ngbTooltip='Rename'></i> 
                    <i class='ft-trash-2  p-1' placement='top' ngbTooltip='Delete!' (click)="deleteSection(section.ids)"></i>
                    <i class='handle ft-move p-1 cursorMove'  placement='top' ngbTooltip='Arrange'></i> 
                  </span> 
                  </div>
                  <div class="MoreStips">
                    <div class="row">
                      <div class="col-2"></div>
                      <div class="col-10"></div>
                    </div>
                    <div class="row">
                      <div class="col-4"></div>
                      <div class="col-8"></div>
                    </div>
                    <div class="row">
                      <div class="col-5"></div>
                      <div class="col-7"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class='drag-drop-container' side = "right" style = "width:50%;" [dragula]="MANY_ITEMS" [(dragulaModel)]='rightresumeSections'>
                <div  class="gu-mirror-stylingcv" *ngFor="let section of rightresumeSections">
                <div class='d-flex align-items-center d-flex justify-content-between'> 
                <i class='fa {{section.icon}} mr-1'></i>
                 <span class='flex-grow-1'> {{section.name}} </span>
                <span class='hideOnDrag'> 
                <i class='ft-edit p-1' (click)="showRenamePopup(section.ids)"  placement='top' ngbTooltip='Rename'></i> 
                <i class='ft-trash-2 p-1' placement='top' ngbTooltip='Delete!' (click)="deleteSection(section.ids)"></i>
                <i class='handle ft-move p-1 cursorMove'  placement='top' ngbTooltip='Arrange'></i> 
                </span> 
                </div>
                  <div class="MoreStips">
                    <div class="row">
                      <div class="col-2"></div>
                      <div class="col-10"></div>
                    </div>
                    <div class="row">
                      <div class="col-4"></div>
                      <div class="col-8"></div>
                    </div>
                    <div class="row">
                      <div class="col-5"></div>
                      <div class="col-7"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class='drag-drop-wrapper' *ngIf="channel_type">
              <div class='drag-drop-container' style = "width:100%;" [dragula]="MANY_ITEMS" [(dragulaModel)]='fullresumeSections'>
                <div class="gu-mirror-stylingcv" *ngFor="let section of fullresumeSections">
                <div class='d-flex align-items-center d-flex justify-content-between'> 
                <i class='fa {{section.icon}} mr-1'></i>
                 <span class='flex-grow-1'> {{section.name}} </span>
                <span class='hideOnDrag'> 
                  <i class='ft-edit p-1' (click)="showRenamePopup(section.ids)"  placement='top' ngbTooltip='Rename'></i> 
                    <i class='ft-trash-2  p-1' placement='top' ngbTooltip='Delete!' (click)="deleteSection(section.ids)"></i>
                    <i class='handle ft-move p-1 cursorMove'  placement='top' ngbTooltip='Arrange'></i> 
                </span> 
                </div>
                </div>
                <div class="MoreStips">
                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-10"></div>
                  </div>
                  <div class="row">
                    <div class="col-4"></div>
                    <div class="col-8"></div>
                  </div>
                  <div class="row">
                    <div class="col-5"></div>
                    <div class="col-7"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-success btn-raised" (click)="submit()"> {{'Save' | translate}} </button>
  </div>
</form>


    
  `
})



export class NgbdModalArrangeSections {
  @Input() meta;
  @Input() data;
  newSection;
  summary = [];
  resumeId;
  resumeData;
  resumeMeta;
  resumeSections;
  channel_type;
  rightresumeSections = [];
  leftresumeSections = [];
  fullresumeSections = [];  

  form: FormGroup;
  resumeIdArray;
  sectionname;
  sectionicon;
  sectionUniqueId ;
  sectionArray ;
  WorkExperinceArray;
  workexperinceform ;
  temporaryArray;

  ngOnInit(){
    this.resumeId = localStorage.getItem('resumeId');
    this.rightresumeSections = [];
    this.leftresumeSections = [];
    this.fullresumeSections = [];
    this.userService.getResume(this.resumeId).subscribe((res) => {
      this.resumeIdArray = res['data'] ? res['data'][0] : res['doc'];
      this.resumeData = res['data'][0];
      this.resumeMeta = res['data'][0].meta;
      this.channel_type = this.resumeMeta.defaultTemplate.resumeColumn == "one" ? true : false;
      
      this.resumeSections = this.resumeData.sections;

      this.summary.push(this.resumeSections[0]);
      this.resumeSections.map((section)=>{
        if(section.type != "section-text"){
          this.fullresumeSections.push(section);
          if(section.rightChannel){
            this.rightresumeSections.push(section);
          } else {
            this.leftresumeSections.push(section);
          }
        }

        
      })

    })
  }

  onComponentupdate(res){
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    this.onSectionupdate(selectedSection || {})
  }
  
  onSectionupdate(res){
    this.sectionUniqueId = res['ids'];
    
    this.sectionArray = res;
    this.WorkExperinceArray = res.subsections;
    
    this.sectionicon = res.icon
    this.sectionname = res.sectionname
  }

    

  items = [
    'Candlestick',
    'Dagger',
    'Revolver',
    'Rope',
    'Pipe',
    'Wrench'
  ];

  public clicked = {
    'one': false,
    'two': false,
    'three': false,
    'four': false,
    'five': false,
    'six': false,
    'seven': false
  };

  public onclick(key: any) {
    
    console.log("key ", key)
    this.clicked[key] = true;
    setTimeout(() => {
      this.clicked[key] = false;
    }, 2000);
  }


  MANY_ITEMS = 'SECTION_ITEMS';

  subs = new Subscription();

  constructor(private dragulaService: DragulaService, public activeModal: NgbActiveModal, 
    private userService: UserService, private global: GlobalService, 
    private router: Router, private http: HttpClient, private modalService: NgbModal,
    public route: ActivatedRoute) {
    this.subs.add(dragulaService.dropModel(this.MANY_ITEMS)
    .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
      if(this.resumeMeta.defaultTemplate.resumeColumn != "one"){
        var side = target.getAttribute('side');
        if(side == "right"){
          this.rightresumeSections = targetModel.map((section)=>{
            section.rightChannel = true;
            return section;
          })
          if(sourceModel != targetModel){
            this.leftresumeSections = sourceModel.map((section) => {
              section.rightChannel = false;
              return section;
            })
          }
          
        } else{
          this.leftresumeSections = targetModel.map((section)=>{
            section.rightChannel = false;
            return section;
          })
          if(sourceModel != targetModel){
            this.rightresumeSections = sourceModel.map((section) => {
              section.rightChannel = true;
              return section;
            })
          }
          
        }
        this.newSection = [...this.summary,...this.leftresumeSections,...this.rightresumeSections];
        
        this.resumeData.sections = this.newSection;
        this.fullresumeSections = [...this.leftresumeSections,...this.rightresumeSections];
      } else {
        this.fullresumeSections = targetModel.map((section)=>{ 
          if(section.type != "section-text"){
            section.rightChannel = false;
            return section;
          }
        })
        this.fullresumeSections.map((section)=>{
          if(section.rightChannel){
            this.rightresumeSections.push(section);
          } else {
            this.leftresumeSections.push(section);
          }
        })
        this.newSection = [...this.summary,...this.fullresumeSections];
        this.resumeData.sections = this.newSection;

      }
      
    })
  );
  }

  
  submit(){
    this.userService.updateresumegeneric(this.resumeId,  this.resumeData).subscribe((res: any) => {
      
      this.global.emitTemplateChange(true);
      this.activeModal.dismiss('Cross click');
    })
  }
  showRenamePopup(section_id){
    this.sectionUniqueId = section_id;
    this.userService.getResume(this.resumeId).subscribe((res) => {
      
      this.onComponentupdate(res);
      const modalRef = this.modalService.open(RenameSectionComponent);
      modalRef.componentInstance.sectionname = this.sectionname;
      modalRef.componentInstance.sectionicon = this.sectionicon;
      modalRef.componentInstance.sectionArray = this.sectionArray;
      modalRef.componentInstance.resumeIdArray = this.resumeIdArray;
      modalRef.componentInstance.WorkExperinceArray = this.WorkExperinceArray;
      modalRef.componentInstance.id = this.resumeId;
      modalRef.componentInstance.workexperinceform = this.workexperinceform;
      modalRef.componentInstance.temporaryArray = this.temporaryArray;
      modalRef.componentInstance.FormGroup = this.form;
      modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;
      
      modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        this.ngOnInit();
      })
    });
  }
  deleteSection(section_id){
    var data = this.resumeIdArray.sections;
    var index = data.findIndex(x => x.ids === section_id);

    data.splice(index, 1);


    this.userService.updateresumegenericsubject(this.resumeId,this.resumeIdArray).subscribe((res : any) => {
      this.ngOnInit();
      // this.activeModal.dismiss('Cross click');
//      this.router.navigate(['/cv/',this.resumeId,'personal-info'], { relativeTo: this.route });
    
    });
  }
}

@Component({
  selector: 'app-user-dashboard',
   
  template: ` 
  <div class="modal-header">
  <h2 style="color:black">{{'Template Lists' | translate}}</h2>
  
  <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"> <i class="ft-x font-medium-3"></i></button>
  </div>
   <div class="modal-body">
   <h3 class="text-center">{{'More designs will be added soon' | translate}}</h3> 
  <h4 class="text-center">{{'You can change the template and colors at any time without having to rewrite the content' | translate}}</h4>
    <div class="row">
 
        <div class="col col-md-12 col-sm-12 col-lg-4" *ngFor="let item of templates; let i = index">
                <div class="card border">
                  <div class="card-body" [ngClass]="{'active': templateSelected===item.name}"> 
                
                  <img   *ngIf="item.isPro"  class="position-absolute tempStatus"  src="assets/img/prem-en.png">
                  <img   *ngIf="!item.isPro"  class="position-absolute  tempStatus"  src="assets/img/basic-en.png">
                   

                    <img alt="{{item.name}}" class="card-img-top img-fluid" (click)="updateTemplate(item)" src="assets/img/templates/{{item.slug}}/img/preview-min.jpg">
                    <div class="card-block  text-center">
                      <h4 class="card-title">{{item.name}}</h4>
                      <a class="btn btn-outline-info btn-round mt-2" (click)="updateTemplate(item)">Use
                      this template</a> </div> 
                  </div>
            </div>
         
      </div>
    </div>
  </div>
  
   
  `
})

export class NgbdModalTemplateLists{
  @Input() templates;
  @Input() resumeId;
  @Input() templateSelected;

  @Output() changeTemplateEvent = new EventEmitter();

  constructor(private dragulaService: DragulaService, 
    public activeModal: NgbActiveModal, 
    private userService: UserService, 
    private router: Router, 
    private http: HttpClient, 
    private modalService: NgbModal,
    public global: GlobalService) {
    this.changeTemplateEvent = new EventEmitter();
  }

  updateTemplate(template:any){
    let meta = {
      meta: template
    }
    this.userService.updateresumetemplate(this.resumeId, meta).subscribe((res: any) => {
      console.log("updateresumegeneric response", res)
      this.activeModal.dismiss('Cross click');
      this.global.emitTemplateChange(true);
      //var customizerInstance = new CustomizerComponent();
      this.changeTemplateEvent.emit(null);
      //CustomizerComponent.
    });
    console.log(template);
  }
}
