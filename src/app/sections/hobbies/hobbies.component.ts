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
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { RenameModalComponent  } from '../../common_modals/rename_modal/rename-modal.component';
@Component({
  selector: 'app-hobbies',
  templateUrl: './hobbies.component.html',
  styleUrls: ['./hobbies.component.scss']
})
export class HobbiesComponent implements OnInit {
  //declarations
  hobbiesArray: any;
  resumeIdArray;
  sectionArray;
  hobbiesform;
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
  sectionicons;
  message: any;
  subscription: Subscription;
  subs = new Subscription();
  MANY_ITEMS = 'HOBBIES_MANY_ITEMS';
  
  public icons ;
  sectionicon;
  hobbies: Boolean = true;
  renamesection: Boolean = false;
  public iconsArray = ["fa-book","fa-bed","fa-bicycle","fa-car ","fa-camera","fa-futbol-o"];
  constructor(fb: FormBuilder, public userService: UserService, private route: ActivatedRoute, public router: Router, public modalService: NgbModal,  public dragulaService: DragulaService) {
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
          console.log("For each", element);
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
        this.userService.setCurrentTab(res, "section-hobbies");
        this. onHobbiesUpdate(res)
        
      });
      this.userService.getSingleSection(this.sectionUniqueId)
      .subscribe((res) => {
          this.onSectionHobbiesUpdate(res['section'])
          console.log("recieved single section-----", res)
      });
    });
  }
  onHobbiesUpdate(res){
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    console.log("selectedSection", selectedSection);
    this.onSectionHobbiesUpdate(selectedSection || {})
  }

  onSectionHobbiesUpdate(res){
    this.sectionUniqueId = res['ids'] || "";
    this.sectionArray = res || [];
    this.hobbiesArray = res.subsections || [];
    console.log("hobbiesArray ", this.hobbiesArray)
    this.sectionname = res.sectionname ;
    this.sectionicons = res.icon;
    
  }
  
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

  iconsChange(data,sectionArray){
    
     sectionArray.icon = data
     this.icons =  sectionArray.icon;
   
    this.sectionicon = sectionArray.icon
    

  }
  onAdd(id : string) {
    this.hobbiesform = "";
    if(this.hobbiesform == ""){
      this.hobbiesform = {
      
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
    console.log("onSubmit function called",form.value)
    var subsections = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      icon:this.sectionicon,
      name: form.value.name,
      opened: false,
      openHelp: false
      
    }
    console.log("Subsection 1",subsections)
    
    this.hobbiesArray.push(subsections)
    console.log("hobbies array 1",this.hobbiesArray)
    let index = this.resumeIdArray.sections.findIndex((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    this.resumeIdArray.sections[index].subsections = this.hobbiesArray;
    

    this.userService.updateresumegeneric(this.id,  this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      form.reset()
      this.add = false;
      this.list = true;
    });
  }
  onEdit(hobbiesArray : any){
    console.log(hobbiesArray)
    window.scrollTo(0, 0)
    this.sectionicon = hobbiesArray.icon;
    this.hobbiesform = {
      ids :  hobbiesArray.ids,
      company_url : hobbiesArray.company_url,
      name : hobbiesArray.name,
      
      opened : hobbiesArray.opened
     

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
      icon:this.sectionicon,
      name : form.value.name,
      opened : false,
     
    }

    this.hobbiesArray.forEach(element => {
      // console.log(element)
      var index = this.hobbiesArray.findIndex(x => x.ids === form.value.ids);
      console.log(index)
      this.hobbiesArray.splice(index, 1, subsections);
    });
   
    let index = this.resumeIdArray.sections.findIndex((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    
    this.resumeIdArray.sections[index].subsections = this.hobbiesArray;
    
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
  onDelete(id : String,hobbiesIndex){
    
    this.hobbiesArray.splice(hobbiesIndex, 1);
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    console.log("computer skills",this.hobbiesArray)
    this.resumeIdArray.sections[sectionIndex].subsections = this.hobbiesArray;
    // console.log("resumeIdArray",this.resumeIdArray)

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      console.log(res)

      this.edit = false;
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
  onClone(hobbiesArray: any) {
    // console.log(this.hobbiesArray)
    var temporaryArray = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      company_url: hobbiesArray.company_url,
      about: hobbiesArray.about,
      name: hobbiesArray.name,
      opened: hobbiesArray.opened,
      speciality: hobbiesArray.speciality,
      start_time_MM: hobbiesArray.start_time_MM,
      start_time_YYYY: hobbiesArray.start_time_YYYY
    }
    this.hobbiesArray.push(temporaryArray)
    // this.lanuageArray.push(this.selectedlanuage);
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    console.log("sectionIndex", sectionIndex);
    this.resumeIdArray.sections[sectionIndex].subsections =  this.hobbiesArray;
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
    modalRef.componentInstance.hobbiesArray = this.hobbiesArray;
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.sub = this.sub;
    modalRef.componentInstance.hobbiesform = this.hobbiesform;
    modalRef.componentInstance.temporaryArray = this.temporaryArray;
    modalRef.componentInstance.FormGroup = this.form;
    modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;
    modalRef.componentInstance.icons = this.icons;

    console.log("modalRef", modalRef);
    
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      
      console.log("receivedEntry", receivedEntry);
      this.onHobbiesUpdate(receivedEntry)
    })
  }
}
