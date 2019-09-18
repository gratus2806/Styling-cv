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
import { RenameModalComponent  } from '../../common_modals/rename_modal/rename-modal.component';
import { DragulaService } from "ng2-dragula";
import { Subscription } from "rxjs";
@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss']
})
export class ReferencesComponent implements OnInit {

 
  referencesArray: any;
  resumeIdArray;
  sectionArray;
  referencesform;
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
  sectionicon;
  icons;
  references: Boolean = true;
  renamesection: Boolean = false;
  message: any;
  subscription: Subscription;
  subs = new Subscription();
  MANY_ITEMS = 'REFERENCE_MANY_ITEMS';



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
  @ViewChild('editor') editor: QuillEditorComponent

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
        this.userService.setCurrentTab(res, "section-references");
        this. onReferencesUpdate(res)
        
      });
      this.userService.getSingleSection(this.sectionUniqueId)
      .subscribe((res) => {
          this.onSectionReferencesUpdate(res['section'])
          console.log("recieved single section-----", res)
      });
    });
  }
  onReferencesUpdate(res){
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    console.log("selectedSection", selectedSection);
    this.onSectionReferencesUpdate(selectedSection || {})
  }

  onSectionReferencesUpdate(res){
    this.sectionUniqueId = res['ids'] || "";
    this.sectionArray = res || [];
    this.referencesArray = res.subsections || [];
    console.log("referencesArray ", this.referencesArray)
    this.sectionname = res.sectionname ;
    this.sectionicon = res.icon;
    
  }
  editWorkexpErience() {
    // this.modalService.open(content, { size: 'lg' });
    const modalRef = this.modalService.open(RenameSectionComponent);
    modalRef.componentInstance.sectionname = this.sectionname;
    modalRef.componentInstance.sectionicon = this.sectionicon;
    modalRef.componentInstance.sectionArray = this.sectionArray;
    modalRef.componentInstance.resumeIdArray = this.resumeIdArray;
    modalRef.componentInstance.referencesArray = this.referencesArray;
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.sub = this.sub;
    modalRef.componentInstance.referencesform = this.referencesform;
    modalRef.componentInstance.temporaryArray = this.temporaryArray;
    modalRef.componentInstance.FormGroup = this.form;
    modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;
    modalRef.componentInstance.icons = this.icons;

    console.log("modalRef", modalRef);
    
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      
      console.log("receivedEntry", receivedEntry);
      this.onReferencesUpdate(receivedEntry)
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
 
  onAdd(id : string) {
    this.referencesform = "";
    if(this.referencesform == ""){
      this.referencesform = {
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
      companyname:form.value.companyname,
      persontitle:form.value.persontitle,
      contactinfo:form.value.contactinfo,
      opened: false,
      openHelp: false,
     
    }
    console.log("Subsection 1",subsections)
    
    this.referencesArray.push(subsections)
    console.log("references array 1",this.referencesArray)
    let index = this.resumeIdArray.sections.findIndex((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    this.resumeIdArray.sections[index].subsections = this.referencesArray;
    

    this.userService.updateresumegeneric(this.id,  this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      form.reset()
      this.add = false;
      this.list = true;
    });
  }
  onEdit(referencesArray : any){
    console.log(referencesArray)
    window.scrollTo(0, 0)
    this.referencesform = {
      ids :  referencesArray.ids,
      company_url : referencesArray.company_url,
      about : referencesArray.about,
      name : referencesArray.name,
      companyname:referencesArray.companyname,
      persontitle:referencesArray.persontitle,
      contactinfo:referencesArray.contactinfo,
      opened : referencesArray.opened
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
      companyname:form.value.companyname,
      persontitle:form.value.persontitle,
      contactinfo:form.value.contactinfo,
      opened : false
     
    }

    this.referencesArray.forEach(element => {
      // console.log(element)
      var index = this.referencesArray.findIndex(x => x.ids === form.value.ids);
      console.log(index)
      this.referencesArray.splice(index, 1, subsections);
    });
   
    let index = this.resumeIdArray.sections.findIndex((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    
    this.resumeIdArray.sections[index].subsections = this.referencesArray;
    
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

    
    console.log(index)
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    this.referencesArray.splice(index, 1);
    var index = this.referencesArray.findIndex(x => x.ids === id);
    console.log("this.referencesArray",this.referencesArray)
     this.resumeIdArray.sections[sectionIndex].subsections =  this.referencesArray;

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
  onClone(referencesArray: any) {
    // console.log(this.referencesArray)
    var temporaryArray = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      company_url: referencesArray.company_url,
      about: referencesArray.about,
      name: referencesArray.name,
      companyname:referencesArray.companyname,
      persontitle:referencesArray.persontitle,
      contactinfo:referencesArray.contactinfo,
      opened: referencesArray.opened
     
    }
    console.log("temporaryArray",temporaryArray)
    this.referencesArray.push(temporaryArray)
    // this.lanuageArray.push(this.selectedlanuage);
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    console.log("sectionIndex", sectionIndex);
    this.resumeIdArray.sections[sectionIndex].subsections =  this.referencesArray;
    this.userService.updateresumegeneric( this.id,this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      this.edit = false;
      this.list = true;
    });
  }


}
