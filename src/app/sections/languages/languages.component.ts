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
import { DragulaService } from "ng2-dragula";
import { RenameSectionComponent } from '../../common_modals/rename-section/rename-section.component';
import { Subscription } from 'rxjs';
import { RenameModalComponent  } from '../../common_modals/rename_modal/rename-modal.component';
@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {
  public id: any;
  selectedlanuage: any;
  resumeIdArray;
  sectionArray;
  educationform;
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
  message: any;
  subscription: Subscription;
  subs = new Subscription();
  MANY_ITEMS = 'LANG_MANY_ITEMS';
  // dataSource = [{ id: 'language1', name: '', currentRate: this.newRating }];
  // languages = [{ languageName: '', languageRate: ''}];
  lanuageArray = [];
  edit = false;
  list = true;
  add = false;
  constructor(fb: FormBuilder, public userService: UserService, private route: ActivatedRoute, public router: Router, public modalService: NgbModal, public dragulaService: DragulaService) { 
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
     
    
    // console.log("hello")
    this.id = localStorage.getItem('resumeId');

    
     
      
      
      this.userService.getResume(this.id).subscribe((res) => {
        this.userService.setCurrentTab(res, "section-work");
        
        this.onLanguageComponentupdate(res)
        
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
  

  onLanguageComponentupdate(res){
    // this.resumeId["id"] = res['data'][0]._id;
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    this.onLanguageSectionupdate(selectedSection || {})
  }
  
  onLanguageSectionupdate(res){
    this.sectionUniqueId = res['ids'];
    // var  workexperince  = element;
    this.sectionArray = res;
    this.lanuageArray = res.subsections;
    console.log("lanuageArray",this.lanuageArray)
    this.sectionicon = res.icon
    this.sectionname = res.sectionname
    console.log("sectionname",this.sectionname)
  }

  
getLanguageNewId(){
  return 'language-' + this.lanuageArray.length + 1;
}

  onAddData() {
    /*this.selectedlanuage = {
      ids : this.getLanguageNewId(),
      rate : this.lanuageArray.length + 1,
      name : ''
    }*/
    console.log("onAdd function called")
    this.selectedlanuage = {
      name: "",
      rate: this.lanuageArray.length + 1
    }
    this.add = true;
    this.list = false;
    this.edit = false;

    // this.edit = true;
    // this.list = false;
  }

  onDelete(index) {
    
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    this.lanuageArray.splice(index, 1);
    console.log("language2",this.lanuageArray)
    this.resumeIdArray.sections[sectionIndex].subsections = this.lanuageArray;
    // console.log("resumeIdArray",this.resumeIdArray)

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      console.log(res)

      this.edit = false;
      this.list = true;
      // location.reload();
    });
  }

  onClone(LanguageArray: any){
    /*this.selectedlanuage = this.lanuageArray[index];
    this.selectedlanuage['ids'] = this.getLanguageNewId();
    this.lanuageArray.push(this.selectedlanuage);
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    console.log("sectionIndex", sectionIndex);
    this.resumeIdArray.sections[sectionIndex].subsections = this.lanuageArray;
    this.userService.updateresumegeneric( this.id,this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      this.edit = false;
      this.list = true;
    });*/
    /***************************/
    console.log("Cloning-->", LanguageArray);
    var tempSkills = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      name: LanguageArray.name,
      rate: LanguageArray.rate
    }
    this.lanuageArray.push(tempSkills);

    let index = this.resumeIdArray.sections.findIndex((section) => {
      console.log("FIND INDEX", "sections", section.ids, "Section Unq id", this.sectionUniqueId)
      return section.ids == this.sectionUniqueId;
    });

    console.log("index", index, "resumeIdArray->", this.resumeIdArray, "this.sectionUniqueId", this.sectionUniqueId);
    this.resumeIdArray.sections[index].subsections = this.lanuageArray;

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      console.log("AFTER CLONE", res);
      console.log(res)

      this.add = false;
      this.list = true;

    });
  }

  onSave(index) {
    console.log("save called", this.selectedlanuage)
        /*console.log("current rating ", this.currentRating);
    console.log("current name", this.name);
    // if(this.edit){
      let selectedIndex = this.lanuageArray.findIndex(x => x.ids === this.selectedlanuage.ids);
      if(~selectedIndex){
        this.lanuageArray[selectedIndex] = this.selectedlanuage;
      }else{
        this.lanuageArray.push(this.selectedlanuage);
      }

   
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    console.log("sectionIndex", sectionIndex);
    this.resumeIdArray.sections[sectionIndex].subsections = this.lanuageArray;
    this.userService.updateresumegeneric( this.id,this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      this.edit = false;
      this.list = true;
    });*/
    // console.log(" this.languages " ,  this.languages)
   
  }

  onBack(){
    this.edit = false;
    this.list = true;
  }

  somethingChanged(data) {
    console.log("change function calling")
    console.log("on change", this.lanuageArray)
  }

  onEdit(LanguageArray: any){
    // this.selectedlanuage = this.lanuageArray[index];
    // this.edit = true;
    // this.list = false;

    console.log("inside edit", LanguageArray)
    this.selectedlanuage = {
      ids: LanguageArray.ids,
      name: LanguageArray.name,
      rate: LanguageArray.rate
    }
    this.list = false;
    this.edit = true;
    this.add = false;
  
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
    modalRef.componentInstance.lanuageArray = this.lanuageArray;
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.sub = this.sub;
    
    modalRef.componentInstance.temporaryArray = this.temporaryArray;
    modalRef.componentInstance.FormGroup = this.form;
    modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;
    modalRef.componentInstance.icons = this.icons;

    
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      
      this.onLanguageComponentupdate(receivedEntry)
    })
  }

  onSubmit(form: NgForm){
    console.log("ON LANG SUB--", form.value)
    var subsections = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      name: form.value.name,
      rate: this.selectedlanuage.rate
    }
    console.log("lanuageArray->", this.lanuageArray, "subsections-->", subsections);
    // return;
    this.lanuageArray.push(subsections);

    console.log("folioArray -->", this.lanuageArray);
    console.log("this.resumeIdArray.sections", this.resumeIdArray.sections)
    let index = this.resumeIdArray.sections.findIndex((section) => {
      return section.ids == this.sectionUniqueId;
    })
    console.log("index", index);
    
    console.log("resumeIdArray->", this.resumeIdArray, "this.sectionUniqueId", this.sectionUniqueId);
    this.resumeIdArray.sections[index].subsections = this.lanuageArray;

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      form.reset()
      this.add = false;
      this.list = true;
    });
  }

  onEditSubmit(form: NgForm) {
    console.log("Language edit", form.value, this.selectedlanuage);
    var subsections = {
      ids: form.value.ids,
      name: form.value.name,
      rate: this.selectedlanuage.rate
    }

    this.lanuageArray.forEach(element => {
      // console.log(element)
      var index = this.lanuageArray.findIndex(x => x.ids === form.value.ids);
      console.log("this is index-->", index)
      this.lanuageArray.splice(index, 1, subsections);
    });

    let index = this.resumeIdArray.sections.findIndex((section) => {
      return section.ids == this.sectionUniqueId;
    })
    console.log("resumeIdArray->", this.resumeIdArray, "this.sectionUniqueId", this.sectionUniqueId);
    this.resumeIdArray.sections[index].subsections = this.lanuageArray;

    console.log("Editing resume ids-->", this.resumeIdArray);

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      console.log("updateresume", res);
      // form.reset()
      this.edit = false;
      this.add = false;
      this.list = true;
    });
  }

}
