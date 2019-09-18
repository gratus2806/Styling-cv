import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../../shared/user.service';
import { Observable, from } from 'rxjs';
import { ActivatedRoute, Router, Params, NavigationExtras } from "@angular/router";
import { SidebarComponent } from 'app/shared/sidebar/sidebar.component'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { workers } from 'cluster';
import { RenameSectionComponent } from '../../common_modals/rename-section/rename-section.component';
import {  DragulaService } from "ng2-dragula";
import { Subscription } from "rxjs";
@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  //declarations
  //declarations
  educationArray: any;
  resumeIdArray;
  sectionArray;
  educationform;
  temporaryArray;
  hide = false;
  isReadOnly = false;
  form: FormGroup;
  public sub: any;
  public id: any;
  resumeId: {};
  sectionname;
  sectionUniqueId;
  sectionicon;
  icons;
  education: Boolean = true;
  renamesection: Boolean = false;
  message: any;
  subscription: Subscription;
  subs = new Subscription();
  MANY_ITEMS = 'EDUCATION_MANY_ITEMS';


  public startDate: Array<Object> = [
    { id: 1, value: "", name: "Dont' Show" },
    { id: 2, value: "", name: "Year Only" },
    { id: 3, value: "Jan", name: '01 - Jan' },
    { id: 4, value: "Feb", name: '02 - Feb' },
    { id: 5, value: "March", name: '03 - March' },
    { id: 6, value: "April", name: '04 - April' },
    { id: 7, value: "May", name: '05 - May' },
    { id: 8, value: "June", name: '06 - June' },
    { id: 9, value: "July", name: '07 - July' },
    { id: 10, value: "August", name: '08 - August' },
    { id: 11, value: "September", name: '09 - September' },
    { id: 12, value: "October", name: '10 - October' },
    { id: 13, value: "November", name: '11 - November' },
    { id: 14, value: "December", name: '12 - December' }
  ];

  public endDate: Array<Object> = [
    { id: 0, value: "Present", name: "Present" },
    { id: 1, value: "", name: "Dont' Show" },
    { id: 2, value: "", name: "Year Only" },
    { id: 3, value: "Jan", name: '01 - Jan' },
    { id: 4, value: "Feb", name: '02 - Feb' },
    { id: 5, value: "March", name: '03 - March' },
    { id: 6, value: "April", name: '04 - April' },
    { id: 7, value: "May", name: '05 - May' },
    { id: 8, value: "June", name: '06 - June' },
    { id: 9, value: "July", name: '07 - July' },
    { id: 10, value: "August", name: '08 - August' },
    { id: 11, value: "September", name: '09 - September' },
    { id: 12, value: "October", name: '10 - October' },
    { id: 13, value: "November", name: '11 - November' },
    { id: 14, value: "December", name: '12 - December' }
  ];

  public year: Array<Object> = [
    { id: 0, name: "Dont't Show" }
  ];

  constructor(fb: FormBuilder, public userService: UserService, private route: ActivatedRoute, public router: Router, public modalService: NgbModal, public dragulaService: DragulaService) {
    this.form = fb.group({
      editor: ['test']
    });
    if (!dragulaService.find(this.MANY_ITEMS)) {
      console.log("MANY ITEMS,->", this.MANY_ITEMS);
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
          console.log("For each", element['name']);
          console.log("SECTION-NAME", this.sectionname);
          if (element['name'] == this.sectionname) {
            element.subsections = sourceModel;
          }
        });

        this.userService.updateresumegenericsubject(this.id, this.resumeIdArray).subscribe((res: any) => {
        });
      })
    );

    this.subs.add(dragulaService.removeModel(this.MANY_ITEMS)
      .subscribe(({ el, source, item, sourceModel }) => {
      })

    );

    this.subscription = this.userService.getMessage().subscribe(message => {
      this.message = message;
    });
  }

 

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
        
        this.onEducationComponentupdate(res)
        
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
  

  onEducationComponentupdate(res){
    // this.resumeId["id"] = res['data'][0]._id;
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    this.onEducationSectionupdate(selectedSection || {})
  }
  
  onEducationSectionupdate(res){
    this.sectionUniqueId = res['ids'];
    // var  workexperince  = element;
    this.sectionArray = res;
    this.educationArray = res.subsections;
    console.log("educationArray",this.educationArray)
    this.sectionicon = res.icon
    this.sectionname = res.sectionname
    console.log("sectionname",this.sectionname)
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
    this.educationform = "";
    if(this.educationform == ""){
      this.educationform = {
      end_time_MM : "Select Month",
      end_time_YYYY : "Select Year",
      start_time_MM : "Select Month",
      start_time_YYYY : "Select Year",
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
      Country: form.value.Country,
      about: form.value.about,
      end_time_MM: form.value.end_time_MM,
      end_time_YYYY: form.value.end_time_YYYY,
      //  end_time_present : false,
      name: form.value.name,
      opened: false,
      openHelp: false,
      speciality: form.value.speciality,
      start_time_MM: form.value.start_time_MM,
      start_time_YYYY: form.value.start_time_YYYY,
    }
    console.log("Subsection 1",subsections)
    
    this.educationArray.push(subsections)
    console.log("Education array 1",this.educationArray)
    let index = this.resumeIdArray.sections.findIndex((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    this.resumeIdArray.sections[index].subsections = this.educationArray;
    

    this.userService.updateresumegeneric(this.id,  this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      form.reset()
      this.add = false;
      this.list = true;
    });
  }

  savesection(icon,sectionname,id,sectionArray,resumeIdArray) {
    sectionArray.sectionname= this.sectionname
    this.userService.updateresumegenericsubject(this.id,this.resumeIdArray).subscribe((res : any) => {
   
    });
    // this.activeModal.close();
    this.modalService.dismissAll();
    // this.activeModal.dismiss()
    // this.activeModal.close();
    this.education = true;
    this.renamesection = false;
  }

  onRenameSection() {
    this.education = false;
    this.renamesection = true;
    console.log("heloo");

  }

  sectionrename(newValue){
    this.sectionname = newValue;   
    
  }

  

  onEdit(educationArray : any){
    console.log(educationArray)
    window.scrollTo(0, 0)
    this.educationform = {
      ids :  educationArray.ids,
      company_url : educationArray.company_url,
      Country : educationArray.Country,
      about : educationArray.about,
      end_time_MM : educationArray.end_time_MM,
      end_time_YYYY : educationArray.end_time_YYYY,
      end_time_present : educationArray.end_time_present,
      name : educationArray.name,
      opened : educationArray.opened,
      speciality : educationArray.speciality,
      start_time_MM : educationArray.start_time_MM,
      start_time_YYYY : educationArray.start_time_YYYY

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

    this.educationArray.forEach(element => {
      // console.log(element)
      var index = this.educationArray.findIndex(x => x.ids === form.value.ids);
      console.log(index)
      this.educationArray.splice(index, 1, subsections);
    });
   
    let index = this.resumeIdArray.sections.findIndex((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    
    this.resumeIdArray.sections[index].subsections = this.educationArray;
    
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
  }

  onDelete(id: String) {

    var index = this.educationArray.findIndex(x => x.ids === id);
    console.log(index)
    this.educationArray.splice(index, 1);
    
    // console.log(this.resumeIdArray)
    // console.log(ROUTES[index])

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

  onClone(educationArray: any) {
    console.log(this.educationArray)
    var temporaryArray = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      company_url: educationArray.company_url,
      Country: educationArray.Country,
      about: educationArray.about,
      end_time_MM: educationArray.end_time_MM,
      end_time_YYYY: educationArray.end_time_YYYY,
      end_time_present: educationArray.end_time_present,
      name: educationArray.name,
      opened: educationArray.opened,
      speciality: educationArray.speciality,
      start_time_MM: educationArray.start_time_MM,
      start_time_YYYY: educationArray.start_time_YYYY
    }
    this.educationArray.push(temporaryArray)
    console.log(this.resumeIdArray)

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)

      this.add = false;
      this.list = true;
      // location.reload();
    });
  }
  editWorkexpErience() {
    // this.modalService.open(content, { size: 'lg' });
    const modalRef = this.modalService.open(RenameSectionComponent);
    modalRef.componentInstance.sectionname = this.sectionname;
    modalRef.componentInstance.sectionicon = this.sectionicon;
    modalRef.componentInstance.sectionArray = this.sectionArray;
    modalRef.componentInstance.resumeIdArray = this.resumeIdArray;
    modalRef.componentInstance.courseArray = this.educationArray;
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.sub = this.sub;
    modalRef.componentInstance.courseform = this.educationform;
    modalRef.componentInstance.temporaryArray = this.temporaryArray;
    modalRef.componentInstance.FormGroup = this.form;
    modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;
    modalRef.componentInstance.icons = this.icons;

    console.log("modalRef", modalRef);
    
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      
      console.log("receivedEntry", receivedEntry);
      this.onEducationComponentupdate(receivedEntry)
    })
  }
  
}
