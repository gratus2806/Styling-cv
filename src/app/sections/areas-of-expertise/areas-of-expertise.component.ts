import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../../shared/user.service';
import { Observable, from } from 'rxjs';
import { ActivatedRoute, Router, Params, NavigationExtras } from "@angular/router";
import { SidebarComponent } from 'app/shared/sidebar/sidebar.component'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Quill from 'quill';
import { workers } from 'cluster';

import { RenameSectionComponent } from '../../common_modals/rename-section/rename-section.component';

@Component({
  selector: 'app-areas-of-expertise',
  templateUrl: './areas-of-expertise.component.html',
  styleUrls: ['./areas-of-expertise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'child'
})
export class AreasOfExpertiseComponent implements OnInit {
  //declarations
  areaofexpertiseArray: any;
  resumeIdArray;
  sectionArray;
  areaofexpertiseform;
  temporaryArray;
  title = 'Quill works!';
  hide = false;
  isReadOnly = false;
  form: FormGroup;
  public sub: any;
  public id: any;
  resumeId: {};
  sectionname;
  sectionUniqueId;

  areaofexpertise: Boolean = true;
  renamesection: Boolean = false;
  public icons ;
  sectionicon;
  public iconsArray = ["fa-book","fa-bed","fa-bicycle","fa-car ","fa-camera","fa-futbol-o"];
  constructor(fb: FormBuilder, public userService: UserService, private route: ActivatedRoute, public router: Router, public modalService: NgbModal,public activeModal: NgbActiveModal) {
      this.form = fb.group({
      editor: ['test']
    });
  }
  @ViewChild('myModal') myModal;
  ngOnInit() {
    this.route.params.subscribe((params)=>{
      this.sectionUniqueId = params['ids'];
      console.log('updatedParams ->',  this.sectionUniqueId);
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
      this.userService.getResume(this.id).subscribe((res) => {
        this.userService.setCurrentTab(res, "section-interests");
        this. onareaofexpertiseUpdate(res)
        
      });
      this.userService.getSingleSection(this.sectionUniqueId)
      .subscribe((res) => {
          this.onSectionareaofexpertiseUpdate(res['section'])
          console.log("recieved single section-----", res)
      });
    });
  }
  onareaofexpertiseUpdate(res){
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    console.log("selectedSection", selectedSection);
    this.onSectionareaofexpertiseUpdate(selectedSection || {})
  }

  onSectionareaofexpertiseUpdate(res){
    this.sectionUniqueId = res['ids'] || "";
    this.sectionArray = res || [];
    this.areaofexpertiseArray = res.subsections || [];
    console.log("areaofexpertiseArray ", this.areaofexpertiseArray)
    this.sectionname = res.sectionname ;
    this.sectionicon = res.icon;
    
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
 
  onAdd(id : string) {
    this.areaofexpertiseform = "";
    if(this.areaofexpertiseform == ""){
      this.areaofexpertiseform = {
      about:""
      }
      // this.start_time_MM = "Select Month"
      // this.start_time_YYYY = "Select Year"
      // this.end_time_MM = "Select Month"
      // this.end_time_YYYY = "Select Year"
    }
  
    console.log("onAdd function called")
    this.add = true;
    this.list = false;
  }
  onSubmit(form: NgForm) {
    console.log("onSubmit function called")
    var subsections = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      about: form.value.about,
      name: form.value.name,
      opened: false,
      openHelp: false
      
    }
    console.log("Subsection 1",subsections)
    
    this.areaofexpertiseArray.push(subsections)
    console.log("areaofexpertise array 1",this.areaofexpertiseArray)
    let index = this.resumeIdArray.sections.findIndex((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    this.resumeIdArray.sections[index].subsections = this.areaofexpertiseArray;
    

    this.userService.updateresumegeneric(this.id,  this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      form.reset()
      this.add = false;
      this.list = true;
    });
  }
  onEdit(areaofexpertiseArray : any){
    console.log(areaofexpertiseArray)
    window.scrollTo(0, 0)
    this.areaofexpertiseform = {
      ids :  areaofexpertiseArray.ids,
      company_url : areaofexpertiseArray.company_url,
      about : areaofexpertiseArray.about,
      name : areaofexpertiseArray.name,
      opened : areaofexpertiseArray.opened,
    }
    this.add = false;
    this.list = false;
    this.edit = true;
    window.scrollTo(0, 0)

  }

  onEditSubmit(form : NgForm){
    console.log("subsecton",subsections);
    var subsections = {
      
      ids :     form.value.ids,
      company_url : "",
      about : form.value.about,
      name : form.value.name,
      opened : false,
     
    }

    this.areaofexpertiseArray.forEach(element => {
      // console.log(element)
      var index = this.areaofexpertiseArray.findIndex(x => x.ids === form.value.ids);
      console.log(index)
      this.areaofexpertiseArray.splice(index, 1, subsections);
    });
   
    let index = this.resumeIdArray.sections.findIndex((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    
    this.resumeIdArray.sections[index].subsections = this.areaofexpertiseArray;
    
    this.userService.updateresumegeneric(this.id,this.resumeIdArray).subscribe((res : any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      form.reset()
      this.edit = false;
      this.list = true;
      // location.reload();
    });
  }
  onCancel(){
    this.list = true;
    this.edit = false;
    this.add = false;
    this.renamesection = false;
  }
  onDelete(id: String) {

    
    
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    this.areaofexpertiseArray.splice(index, 1);
    var index = this.areaofexpertiseArray.findIndex(x => x.ids === id);
    console.log("this.areaofexpertiseArray",this.areaofexpertiseArray)
     this.resumeIdArray.sections[sectionIndex].subsections =  this.areaofexpertiseArray;

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)

      this.add = false;
      this.list = true;
      // location.reload();
    });

  }
  confirmCancelButton(){
    // console.log(this.resumeIdArray)
    // console.log(this.sectionUniqueId)
     var data = this.resumeIdArray.sections;
     var index = data.findIndex(x => x.ids === this.sectionUniqueId);
    //  console.log(index)
     data.splice(index, 1);
    
     this.userService.updateresumegenericsubject(this.id,this.resumeIdArray).subscribe((res : any) => {
    });
    this.router.navigate(['/cv/',this.id,'personal-info'], { relativeTo: this.route });
    //  this.router.navigateByUrl('/personal-info');

    //  data.forEach(element => {
    //   // console.log(element)
    //   if(element['name'] == "Work Experience"){
    //    console.log("hello enbter")

    //   }
    // });

  }
  onClone(areaofexpertiseArray: any) {
    // console.log(this.areaofexpertiseArray)
    var temporaryArray = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      company_url: areaofexpertiseArray.company_url,
      about: areaofexpertiseArray.about,
      name: areaofexpertiseArray.name,
      opened: areaofexpertiseArray.opened
     
    }
    this.areaofexpertiseArray.push(temporaryArray)
    // this.lanuageArray.push(this.selectedlanuage);
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    console.log("sectionIndex", sectionIndex);
    this.resumeIdArray.sections[sectionIndex].subsections =  this.areaofexpertiseArray;
    this.userService.updateresumegeneric( this.id,this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      this.edit = false;
      this.list = true;
    });
  }
  editWorkexpErience() {
    // this.modalService.open(content, { size: 'lg' });
    const modalRef = this.modalService.open(RenameSectionComponent);
    modalRef.componentInstance.sectionname = this.sectionname;
    modalRef.componentInstance.sectionicon = this.sectionicon;
    modalRef.componentInstance.sectionArray = this.sectionArray;
    modalRef.componentInstance.resumeIdArray = this.resumeIdArray;
    modalRef.componentInstance.areaofexpertiseArray = this.areaofexpertiseArray;
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.sub = this.sub;
    modalRef.componentInstance.areaofexpertiseform = this.areaofexpertiseform;
    modalRef.componentInstance.temporaryArray = this.temporaryArray;
    modalRef.componentInstance.FormGroup = this.form;
    modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;
    modalRef.componentInstance.icons = this.icons;

    console.log("modalRef", modalRef);
    
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      
      console.log("receivedEntry", receivedEntry);
      this.onareaofexpertiseUpdate(receivedEntry)
    })
  }
  savesection(icon,sectionname,id,sectionArray,resumeIdArray){
    // console.log(icon,sectionname)
    // sectionArray.icon = icon
    // sectionArray.sectionname = sectionname
    // console.log(sectionArray)
    // console.log(this.sectionname,this.sectionicon)
    // console.log(sectionArray)
    sectionArray.sectionname= this.sectionname
    // console.log(this.id)
    // console.log(this.resumeIdArray)
    // this.activeModal.close();
    this.userService.updateresumegenericsubject(this.id,this.resumeIdArray).subscribe((res : any) => {
  
      // class1Instance.ngOnInit(); 
    });
    // this.activeModal.close();
    this.modalService.dismissAll();
    this.activeModal.dismiss()
    // this.activeModal.close();
  }

  iconschangeFunction(id,data,sectionArray,resumeIdArray){
    // console.log(id,data,sectionArray,resumeIdArray)
    sectionArray.icon = data
    this.icons =  sectionArray.icon;
    // console.log(data)
    // console.log(data)
    // console.log(this.sectionname)
    this.sectionicon = sectionArray.icon
    // this.sectionname = sectionArray.sectionname
    // console.log(sectionArray.icon);
    // console.log(sectionArray.sectionname);
  
    // this.onRenameSection()
      // this.userService.updateresumegenericsubject(id,resumeIdArray).subscribe((res : any) => {
    
        // let class1Instance = new WorkExperienceComponent (this.fb,this.userService,this.dragulaService,this.route,this.router,this.translate,this.modalService)
        //   // let class1Instance = new SidebarComponent(this.router, this.route, this.translate, this.userService, this.modalService, this.activeModal); 
        // class1Instance.onRenameSection(id,sectionArray.icon,sectionArray.sectionname,sectionArray,resumeIdArray); 
      // });
      // this.activeModal.close();

  }

  openModal() {
    console.log("mdoal")
    this.myModal.nativeElement.className = 'modal fade show';
    // this.myModal.nativeElement
    // this.myModal.show();
            // this.bsModalRef = this.modalService.show(this.elementView);

  }
  
  

  ngOnDestroy() { 
    
  }

  sectionrename(newValue){
    // this.sectionArray.sectionname = newValue
    this.sectionname = newValue
    console.log("workexp",this.sectionname)
    // console.log(this.resumeIdArray)
    // this.userService.updateresumegenericsubject(this.id,this.resumeIdArray).subscribe((res : any) => {
    //   // let class1Instance = new SidebarComponent(this.router, this.route, this.translate, this.userService, this.modalService); 
    //   //   let class1Instance = new SidebarComponent(this.router, this.route, this.translate, this.userService, this.modalService, this.activeModal); 
    //   // class1Instance.ngOnInit(); 
    // });
    //  this.ngOnInit();    
    
  }
}
