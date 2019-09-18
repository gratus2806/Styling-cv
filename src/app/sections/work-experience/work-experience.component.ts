import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { QuillEditorComponent } from 'ngx-quill';
import { UserService } from '../../shared/user.service';
import {ActivatedRoute, Router, Params,NavigationExtras } from "@angular/router";
import { debounceTime,  distinctUntilChanged} from 'rxjs/operators';
import {SidebarComponent} from 'app/shared/sidebar/sidebar.component'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DragulaService } from 'ng2-dragula';
import { RenameSectionComponent } from '../../common_modals/rename-section/rename-section.component';
export {FormBuilder}
import Quill from 'quill';
import { workers } from 'cluster';
import { ModalsComponent } from 'app/components/bootstrap/modals/modals.component';
// import { DragAndDropModule } from 'angular-draggable-droppable';
import { RenameModalComponent  } from '../../common_modals/rename_modal/rename-modal.component';
@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'child'

})
export class WorkExperienceComponent implements OnInit,OnDestroy {
//declarations
WorkExperinceArray : any;
resumeIdArray ;
sectionArray ;
workexperinceform ;
temporaryArray ;
title = 'Quill works!';
hide = false;
isReadOnly = false;
form: FormGroup;
public sub: any;
public id :any;
resumeId : {};
sectionname;
sectionicon;
icons;
sectionUniqueId ;
startdate : Boolean = true;
enddate: Boolean = true;
start_time_MM ;
start_time_YYYY ;
end_time_MM;
end_time_YYYY ;
 

workexperience: Boolean = true;
renamesection : Boolean = false;


public startDate:Array<Object> = [
  {id: 1, value : " ",name: "Hide"},
  {id: 2, value : "",name: "Year only"},
  {id: 3, value : "Jan",name: '01 - Jan'},
  {id: 4, value : "Feb",name: '02 - Feb'},
  {id: 5, value : "March",name: '03 - March'},
  {id: 6, value : "April",name: '04 - April'},
  {id: 7, value : "May",name: '05 - May'},
  {id: 8, value : "June",name: '06 - June'},
  {id: 9, value : "July",name: '07 - July'},
  {id: 10, value : "August",name: '08 - August'},
  {id: 11, value : "September",name: '09 - September'},
  {id: 12, value : "October",name: '10 - October'},
  {id: 13, value : "November",name: '11 - November'},
  {id: 14, value : "December",name: '12 - December'},
  {id: 15, value : "Select Month",name: 'Select Month'}
];


 
public endDate:Array<Object> = [
  {id: 0, value : "Present",name: "Present"},
  {id: 1, value : " ",name: "Hide"},
  {id: 2, value : "",name: "Year only"},
  {id: 3, value : "Jan",name: '01 - Jan'},
  {id: 4, value : "Feb",name: '02 - Feb'},
  {id: 5, value : "March",name: '03 - March'},
  {id: 6, value : "April",name: '04 - April'},
  {id: 7, value : "May",name: '05 - May'},
  {id: 8, value : "June",name: '06 - June'},
  {id: 9, value : "July",name: '07 - July'},
  {id: 10, value : "August",name: '08 - August'},
  {id: 11, value : "September",name: '09 - September'},
  {id: 12, value : "October",name: '10 - October'},
  {id: 13, value : "November",name: '11 - November'},
  {id: 14, value : "December",name: '12 - December'},
  {id: 15, value : "Select Month",name: 'Select Month'}
];

public year : Array<Object> = [
  {id: 0 , name: "Select Year"}
];
countryForm: FormGroup;
message: any;
subscription: Subscription;
subs = new Subscription();
MANY_ITEMS = 'WORK_EXP_MANY_ITEMS';
constructor(public  fb: FormBuilder, public userService : UserService, public dragulaService: DragulaService, private route : ActivatedRoute,public router: Router, public modalService: NgbModal,public activeModal: NgbActiveModal) {
  this.form = fb.group({
    editor: ['test']

    
  });

  if(!dragulaService.find(this.MANY_ITEMS)){
    dragulaService.createGroup(this.MANY_ITEMS, {
      moves: (el, container, handle) => {
        return handle.className === 'handle ft-move mr-1 grey p-1 cursorMove';
      }
    });
    
  }




  this.subs.add(dragulaService.dropModel(this.MANY_ITEMS)
    .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
      
      var data = this.resumeIdArray.sections;
      data.forEach(element => {
        // console.log(element)
        console.log("For each", element['name']);
        if(element['name'] == this.sectionname){
          element.subsections = sourceModel;
        }
      });
      // console.log(this.id)
      // console.log(this.resumeIdArray);
      this.userService.updateresumegenericsubject(this.id,this.resumeIdArray).subscribe((res : any) => {
      });

    })
  );
  this.subs.add(dragulaService.removeModel(this.MANY_ITEMS)
    .subscribe(({ el, source, item, sourceModel }) => {
    })
  );

  this.subscription = this.userService.getMessage().subscribe(message => { this.message = message; 
    // console.log(this.message);
    // this.resumeIdArray = this.message;
    // console.log(this.resumeIdArray);
    // this.ngOnInit()
  });

} 
@ViewChild('editor') editor: QuillEditorComponent
@ViewChild('myModal') myModal;
  ngOnInit() {
    this.route.params.subscribe((params)=>{
      this.sectionUniqueId = params['ids'];
      var i,j;
    for(i="1967",j="1";i<= "2020";i++,j++){
      this.year.push({id: j,name : i})
    }
    // console.log("hello")
    this.id = localStorage.getItem('resumeId');

    this.form
      .controls
      .editor
      .valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(data => {
        console.log('native fromControl value changes with debounce', data)
      });
      this.startDate["id"] = "3";
      // this.start_time_MM = "01 - Jan";
      
      this.userService.getResume(this.id).subscribe((res) => {
        this.userService.setCurrentTab(res, "section-work");
        
        this.onComponentupdate(res)
        
      });
      /*** 
       * Get single section service
       * */
      this.userService.getSingleSection(params.ids)
      .subscribe((res) => {
          //this.onSectionupdate(res['section'])
        console.log("recieved single section", res)
      });
    });
  }
  

  onComponentupdate(res){
    // this.resumeId["id"] = res['data'][0]._id;
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    this.onSectionupdate(selectedSection || {})
  }
  
  onSectionupdate(res){
    this.sectionUniqueId = res['ids'];
    // var  workexperince  = element;
    this.sectionArray = res;
    this.WorkExperinceArray = res.subsections;
    
    this.sectionicon = res.icon
    this.sectionname = res.sectionname
  }
  

  savesection(icon,sectionname,id,sectionArray,resumeIdArray){
    sectionArray.sectionname= this.sectionname
    this.userService.updateresumegenericsubject(this.id,this.resumeIdArray).subscribe((res : any) => {
    });
    this.modalService.dismissAll();
    this.activeModal.dismiss()
  }

  iconschangeFunction(id,data,sectionArray,resumeIdArray){
    // console.log(id,data,sectionArray,resumeIdArray)
    sectionArray.icon = data
    this.icons =  sectionArray.icon;
    this.sectionicon = sectionArray.icon
  }

  openModal() {
    console.log("mdoal")
    this.myModal.nativeElement.className = 'modal fade show';
  }
  
  

  ngOnDestroy() { 
    
  }

  sectionrename(newValue){
    this.sectionname = newValue 
  }

  confirmCancelButton(){
     var data = this.resumeIdArray.sections;
     var index = data.findIndex(x => x.ids === this.sectionUniqueId);

     data.splice(index, 1);
    
    this.userService.updateresumegenericsubject(this.id,this.resumeIdArray).subscribe((res : any) => {
    });
    this.router.navigate(['/cv/',this.id,'personal-info'], { relativeTo: this.route });
    

  }

  startdatechangefunction(data){
  if(data == " "){
    // console.log("hello");
    this.startdate = false;
    
  }else{
    this.startdate = true;
  }

  }

  enddatechangefunction(data){
    if(data == " " || data == "Present"){
      // console.log("hello");
  
      this.enddate = false;
      
    }else{
      this.enddate = true;
    }
  }

  // savesection(){
  //   this.workexperience = true;
  //   this.renamesection = false;
  // }
  

  onRenameSection(id,sectionicon,sectionname,sectionArray,resumeIdArray){
    // this.workexperience = false;
    // this.renamesection = true;
    // console.log(sectionicon);
    // const modalRef = this.modalService.open(NgbdModalAddNewSection);
    //     modalRef.componentInstance.id = id
    //     modalRef.componentInstance.icon = sectionicon
    //     modalRef.componentInstance.sectionname = sectionname
    //     modalRef.componentInstance.sectionArray = sectionArray
    //     modalRef.componentInstance.resumeIdArray = resumeIdArray
    
  }
 
  editWorkexpErience() {
    // this.modalService.open(content, { size: 'lg' });
    const modalRef = this.modalService.open(RenameSectionComponent);
    modalRef.componentInstance.sectionname = this.sectionname;
    modalRef.componentInstance.sectionicon = this.sectionicon;
    modalRef.componentInstance.sectionArray = this.sectionArray;
    modalRef.componentInstance.resumeIdArray = this.resumeIdArray;
    modalRef.componentInstance.WorkExperinceArray = this.WorkExperinceArray;
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.sub = this.sub;
    modalRef.componentInstance.workexperinceform = this.workexperinceform;
    modalRef.componentInstance.temporaryArray = this.temporaryArray;
    modalRef.componentInstance.FormGroup = this.form;
    modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;
    
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.onComponentupdate(receivedEntry)
    })
   
  }
   //events starts
   setFocus($event) {
    $event.focus();
  }

  patchValue() {
    this.form.controls['editor'].patchValue(`${this.form.controls['editor'].value} patched!`)
  }

  toggleReadOnly() {
    this.isReadOnly = !this.isReadOnly;
  }

  logChange($event: any) {
    //your code here
  }

  logSelection($event: any) {
    //your code here
  }
  //events ends
  add = false;
  list = true;
  edit = false;

  onAdd(id : string){
    console.log("add button clicked");
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
          window.clearInterval(scrollToTop);
      }
      this.workexperinceform = "";
      if(this.workexperinceform == ""){
        this.workexperinceform = {
        end_time_MM : "Select Month",
        end_time_YYYY : "Select Year",
        start_time_MM : "Select Month",
        start_time_YYYY : "Select Year",
          about:""
        }
      }
  
      this.edit = true;
      this.list = false;
    }, 16);
    

  }

  onSubmit(form : NgForm){
     var subsections = {
      ids :      Math.floor(10000000000 + Math.random() * 90000000000),
      company_url : "",
      Country : form.value.Country,
      about : form.value.about,
      end_time_MM : form.value.end_time_MM,
      end_time_YYYY : form.value.end_time_YYYY,
      end_time_present : false,
      name : form.value.name,
      opened : false,
      speciality : form.value.speciality,
      start_time_MM : form.value.start_time_MM,
      start_time_YYYY : form.value.start_time_YYYY,
    }

    this.WorkExperinceArray.push(subsections)
    // console.log(this.WorkExperinceArray)
    // console.log(this.resumeIdArray)

    this.userService.updateresumegeneric(this.id,this.resumeIdArray).subscribe((res : any) => {
      // console.log("updateresume", res.doc._id);
      // console.log(res)
      form.reset()
      this.add = false;
      this.list = true;





      // location.reload();

    });
    
    


  }

  onDelete(id : String){

      var index = this.WorkExperinceArray.findIndex(x => x.ids === id);
      // console.log(index)
      this.WorkExperinceArray.splice(index, 1);
      // console.log(this.WorkExperinceArray)
      // console.log(this.resumeIdArray)
      // console.log(ROUTES[index])

      this.userService.updateresumegeneric(this.id,this.resumeIdArray).subscribe((res : any) => {
        // console.log("updateresume", res.doc._id);
        console.log(res)

        this.add = false;
        this.list = true;
        // location.reload();
      });

  }

  onClone(WorkExperinceArray : any){
    // console.log(this.WorkExperinceArray)
    var temporaryArray = {
      ids :  Math.floor(10000000000 + Math.random() * 90000000000),
      company_url : WorkExperinceArray.company_url,
      Country : WorkExperinceArray.Country,
      about : WorkExperinceArray.about,
      end_time_MM : WorkExperinceArray.end_time_MM,
      end_time_YYYY : WorkExperinceArray.end_time_YYYY,
      end_time_present : WorkExperinceArray.end_time_present,
      name : WorkExperinceArray.name,
      opened : WorkExperinceArray.opened,
      speciality : WorkExperinceArray.speciality,
      start_time_MM : WorkExperinceArray.start_time_MM,
      start_time_YYYY : WorkExperinceArray.start_time_YYYY
    }
    this.WorkExperinceArray.push(temporaryArray)
    // console.log(this.resumeIdArray)

    this.userService.updateresumegeneric(this.id,this.resumeIdArray).subscribe((res : any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)

      this.add = false;
      this.list = true;
      // location.reload();
    });
    
    

  }

  onEdit(WorkExperinceArray : any){

    // console.log(WorkExperinceArray)
    if(WorkExperinceArray.start_time_MM == " "){
      this.startdate = false;
    }
    if(WorkExperinceArray.end_time_MM == " " || WorkExperinceArray.end_time_MM == "Present"){
      this.enddate = false;
    }
    this.workexperinceform = {
      ids :  WorkExperinceArray.ids,
      company_url : WorkExperinceArray.company_url,
      Country : WorkExperinceArray.Country,
      about : WorkExperinceArray.about,
      end_time_MM : WorkExperinceArray.end_time_MM,
      end_time_YYYY : WorkExperinceArray.end_time_YYYY,
      end_time_present : WorkExperinceArray.end_time_present,
      name : WorkExperinceArray.name,
      opened : WorkExperinceArray.opened,
      speciality : WorkExperinceArray.speciality,
      start_time_MM : WorkExperinceArray.start_time_MM,
      start_time_YYYY : WorkExperinceArray.start_time_YYYY

    }
    this.add = false;
    this.list = false;
    this.edit = true;

    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
          window.clearInterval(scrollToTop);
      }
    }, 16);
  }

  onEditSubmit(form : NgForm){
    var subsections;
    // console.log(form.value.ids)

    // console.log(this.WorkExperinceArray)
    if(!form.value.ids){
       subsections = {
        ids :      Math.floor(10000000000 + Math.random() * 90000000000),
        company_url : "",
        Country : form.value.Country,
        about : form.value.about,
        end_time_MM : form.value.end_time_MM,
        end_time_YYYY : form.value.end_time_YYYY,
        end_time_present : false,
        name : form.value.name,
        opened : false,
        speciality : form.value.speciality,
        start_time_MM : form.value.start_time_MM,
        start_time_YYYY : form.value.start_time_YYYY,
      }
  
      this.WorkExperinceArray.push(subsections)
      console.log(this.WorkExperinceArray)
      // console.log(this.resumeIdArray)

    }else{
       subsections = {
      ids :     form.value.ids,
      company_url : "",
      Country : form.value.Country,
      about : form.value.about,
      end_time_MM : form.value.end_time_MM,
      end_time_YYYY : form.value.end_time_YYYY,
      end_time_present : false,
      name : form.value.name,
      opened : false,
      speciality : form.value.speciality,
      start_time_MM : form.value.start_time_MM,
      start_time_YYYY : form.value.start_time_YYYY,
    }

    this.WorkExperinceArray.forEach(element => {
      // console.log(element)
      var index = this.WorkExperinceArray.findIndex(x => x.ids === form.value.ids);
      // console.log(index)
      this.WorkExperinceArray.splice(index, 1);
      this.WorkExperinceArray.splice(index, 0,subsections);
    // this.WorkExperinceArray.push(subsections)
    });
    // console.log(this.WorkExperinceArray)

    }

    console.log("this.WorkExperinceArray", this.WorkExperinceArray);
  
    let index = this.resumeIdArray.sections.findIndex((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    this.resumeIdArray.sections[index].subsections = this.WorkExperinceArray;

    this.userService.updateresumegeneric(this.id,this.resumeIdArray).subscribe((res : any) => {
      // console.log("updateresume", res.doc._id);
      // console.log(res)
      form.reset()
      this.edit = false;
      this.list = true;
      window.scrollTo(0, 0)

      // location.reload();
    });
  }

  onCancel(){
    this.list = true;
    this.edit = false;
    this.add = false;
  }

  config = {
    toolbar : [
      ['bold', 'italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }, 'clean', 'link']
    ]
  }
}