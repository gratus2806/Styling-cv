import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
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
  selector: 'app-computer-skills',
  templateUrl: './computer-skills.component.html',
  styleUrls: ['./computer-skills.component.scss']
})
export class ComputerSkillsComponent implements OnInit {
  public id: any;
  selectedcomputerskill: any;
  resumeIdArray;
  sectionArray;
  computerskillform;
  temporaryArray;
  title = 'Quill works!';
  hide = false;
  isReadOnly = false;
  form: FormGroup;
  public sub: any;
  //public id: any;
  resumeId: {};
  sectionname;
  sectionUniqueId;
  name = '';
  newItemNo = 0;
  newRating = 6;
  sectionicon;
  icons;
  // dataSource = [{ id: 'skill1', name: '', currentRate: this.newRating }];
  computerskillArray = [];
  edit = false;
  list = true;

  constructor(fb: FormBuilder, public userService: UserService, private route: ActivatedRoute, public router: Router, public modalService: NgbModal) { 
    this.form = fb.group({
      editor: ['test']
    });
  }
  @ViewChild('editor') editor: QuillEditorComponent

  ngOnInit() {
    this.route.params.subscribe((params)=>{
      this.sectionUniqueId = params['ids'];

      console.log('updatedParams ->',  this.sectionUniqueId);
    
    console.log("hello")
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
        this.userService.setCurrentTab(res, "section-computer-skills");
        this. onComputerSkillsUpdate(res)
        
      });
      this.userService.getSingleSection(this.sectionUniqueId)
      .subscribe((res) => {
          this.onSectionComputerSkillsUpdate(res['section'])
          console.log("recieved single section-----", res)
      });
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
  }
  onComputerSkillsUpdate(res){
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    console.log("selectedSection", selectedSection);
    this.onSectionComputerSkillsUpdate(selectedSection || {})
  }

  onSectionComputerSkillsUpdate(res){
    this.sectionUniqueId = res['ids'] || "";
    this.sectionArray = res || [];
    this.computerskillArray = res.subsections || [];
    console.log("ComputerSkillsArray ", this.computerskillArray)
    this.sectionname = res.sectionname ;
    this.sectionicon = res.icon;
    
  }
  getLanguageNewId(){
    return 'skill-' + this.computerskillArray.length + 1;
  }
  
    onAddData() {
      this.selectedcomputerskill = {
        ids : this.getLanguageNewId(),
        rate : this.computerskillArray.length + 1,
        name : ''
      }
      this.edit = true;
      this.list = false;
    }
  
    onDelete(index) {
     
      this.computerskillArray.splice(index, 1);
      let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
      console.log("computer skills",this.computerskillArray)
      this.resumeIdArray.sections[sectionIndex].subsections = this.computerskillArray;
      // console.log("resumeIdArray",this.resumeIdArray)
  
      this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
        console.log(res)
  
        this.edit = false;
        this.list = true;
        // location.reload();
      });
    }
  
    onClone(index){
      this.selectedcomputerskill = this.computerskillArray[index];
      this.selectedcomputerskill['ids'] = this.getLanguageNewId();
      this.computerskillArray.push(this.selectedcomputerskill);
      let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
      console.log("sectionIndex", sectionIndex);
      this.resumeIdArray.sections[sectionIndex].subsections = this.computerskillArray;
      this.userService.updateresumegeneric( this.id,this.resumeIdArray).subscribe((res: any) => {
        // console.log("updateresume", res.doc._id);
        console.log(res)
        this.edit = false;
        this.list = true;
      });
    }
  
    onSave() {
      console.log("current rating ", this.currentRating);
      console.log("current name", this.name);
      // if(this.edit){
        let selectedIndex = this.computerskillArray.findIndex(x => x.ids === this.selectedcomputerskill.ids);
        if(~selectedIndex){
          this.computerskillArray[selectedIndex] = this.selectedcomputerskill;
        }else{
          this.computerskillArray.push(this.selectedcomputerskill);
        }
        
        //this.computerskillArray.splice(index, 1, subsection);
      // } else{
      console.log("selectedIndex",selectedIndex,this.computerskillArray)
        
        
      // }
  
      console.log("atfer computerskillArray", this.computerskillArray)
      let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
      console.log("sectionIndex", sectionIndex);
      this.resumeIdArray.sections[sectionIndex].subsections = this.computerskillArray;
      this.userService.updateresumegeneric( this.id,this.resumeIdArray).subscribe((res: any) => {
        // console.log("updateresume", res.doc._id);
        console.log(res)
        this.edit = false;
        this.list = true;
      });
      // console.log(" this.languages " ,  this.languages)
     
    }
  
    onBack(){
      this.edit = false;
      this.list = true;
    }
  
    somethingChanged(data) {
      console.log("change function calling")
      console.log("on change", this.computerskillArray)
    }
  
    onEdit(index){
      this.selectedcomputerskill = this.computerskillArray[index];
      this.edit = true;
      this.list = false;
    
    }
  
    // Variable Declaration
    currentRate = 8;
    currentRating = 6;
    selected = 0;
    hovered = 0;
    readonly = false;
    decimalCurrentRate = 3.14;
  
    // Form integration
    ctrl = new FormControl(null, Validators.required);
  
    toggle() {
      if (this.ctrl.disabled) {
        this.ctrl.enable();
      } else {
        this.ctrl.disable();
      }
    }
    editWorkexpErience() {
      // this.modalService.open(content, { size: 'lg' });
      const modalRef = this.modalService.open(RenameSectionComponent);
      modalRef.componentInstance.sectionname = this.sectionname;
      modalRef.componentInstance.sectionicon = this.sectionicon;
      modalRef.componentInstance.sectionArray = this.sectionArray;
      modalRef.componentInstance.resumeIdArray = this.resumeIdArray;
      modalRef.componentInstance.computerskillArray = this.computerskillArray;
      modalRef.componentInstance.id = this.id;
      modalRef.componentInstance.sub = this.sub;
      modalRef.componentInstance.computerskillform = this.computerskillform;
      modalRef.componentInstance.temporaryArray = this.temporaryArray;
      modalRef.componentInstance.FormGroup = this.form;
      modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;
      modalRef.componentInstance.icons = this.icons;
  
      console.log("modalRef", modalRef);
      
      modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        
        console.log("receivedEntry", receivedEntry);
        this.onComputerSkillsUpdate(receivedEntry)
      })
    }

}
