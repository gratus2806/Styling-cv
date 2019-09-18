import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from '../../shared/user.service';
import { QuillEditorComponent } from 'ngx-quill';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { debounceTime,  distinctUntilChanged} from 'rxjs/operators';
import { RenameSectionComponent } from '../../common_modals/rename-section/rename-section.component';
import {ActivatedRoute, Router} from "@angular/router";

import Quill from 'quill';
const Clipboard = Quill.import('modules/clipboard')
const Delta = Quill.import('delta')

class PlainClipboard extends Clipboard {
  onPaste (e) {
    e.preventDefault()
    const range = this.quill.getSelection()
    const text = e.clipboardData.getData('text/plain')
    const delta = new Delta()
    .retain(range.index)
    .delete(range.length)
    .insert(text)
    const index = text.length + range.index
    const length = 0
    this.quill.updateContents(delta, 'silent')
    this.quill.setSelection(index, length, 'silent')
    this.quill.scrollIntoView()
  }
}

Quill.register('modules/clipboard', PlainClipboard, true)
  
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
 //declarations
 title = 'Quill works!';
 hide = false;
 isReadOnly = false;
 form: FormGroup;
 public id :any;
resumeIdArray;
about;
summaryArray;

sectionname;
sectionicon;
sectionUniqueId ;
sectionArray ;
WorkExperinceArray;
workexperinceform ;
temporaryArray;

 constructor(fb: FormBuilder,private userService: UserService, 
  public modalService: NgbModal,public activeModal: NgbActiveModal,
  private route : ActivatedRoute,public router: Router,) {
   this.form = fb.group({
     editor: ['test']
   });
 }
 @ViewChild('editor') editor: QuillEditorComponent

  // constructor() { }

  ngOnInit() {
    localStorage.setItem("currentTab", '0');
    this.id = localStorage.getItem('resumeId');
    this.route.params.subscribe((params)=>{
      this.sectionUniqueId = params['ids'];
    });
    this.userService.getResume(this.id).subscribe((res) => {
      this.resumeIdArray = res['data'][0];
      var data = res['data'][0].sections;
      data.forEach(element => {
        if(element['name'] == "Summary" || element['name'] == "المقدمة"){
          this.summaryArray = element;
          this.about =  element.about;
        }
      });
      // console.log(this.summaryArray)
    });


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

    // this.editor
    //   .onContentChanged
    //   .pipe(
    //     debounceTime(400),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(data => {
    //     console.log('view child + directly subscription', data)
    //   });
    

      this.userService.getResume(this.id).subscribe((res) => {
        this.onComponentupdate(res)
        
      });
  }

  summaryChange(newValue) {
    this.summaryArray.about = newValue;
    this.userService.updateresumegeneric(this.id,this.resumeIdArray).subscribe((res : any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      // location.reload();
    });
    
  }

  editWorkexpErience() {
    console.log("ssssssssdfdf");
    console.log(this.sectionname);
    // this.modalService.open(content, { size: 'lg' });
    const modalRef = this.modalService.open(RenameSectionComponent);
    modalRef.componentInstance.sectionname = this.sectionname;
    modalRef.componentInstance.sectionicon = this.sectionicon;
    modalRef.componentInstance.sectionArray = this.sectionArray;
    modalRef.componentInstance.resumeIdArray = this.resumeIdArray;
    modalRef.componentInstance.WorkExperinceArray = this.WorkExperinceArray;
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.workexperinceform = this.workexperinceform;
    modalRef.componentInstance.temporaryArray = this.temporaryArray;
    modalRef.componentInstance.FormGroup = this.form;
    modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;
    
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      this.onComponentupdate(receivedEntry)
    })
   
  }

  onComponentupdate(res){
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    console.log("selectedSection", selectedSection);
    this.onSectionupdate(selectedSection || {})
  }
  
  onSectionupdate(res){
    this.sectionUniqueId = res['ids'];
    this.sectionArray = res;
    this.WorkExperinceArray = res.subsections;
    console.log("workExperienceArray",this.WorkExperinceArray)
    console.log(res);
    this.sectionicon = res.icon
    this.sectionname = res.sectionname
  }

  //events starts
  setFocus($event) {
    console.log($event);
    
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

  config = {
    toolbar : [
      ['bold', 'italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }, 'clean', 'link']
    ]
  }

}
