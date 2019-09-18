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


import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit {
  public id: any;
  selectedsoftware: any;
  resumeIdArray;
  sectionArray;
  softwareform;
  temporaryArray;
  title = 'Quill works!';
  hide = false;
  isReadOnly = false;
  form: FormGroup;
  public sub: any;
  //public id: any;
  resumeId: {};
  sectionname;
  sectionicon;
  icons;
  sectionUniqueId;
  name = '';
  newItemNo = 0;
  newRating = 6;
  message: any;
  subscription: Subscription;
  subs = new Subscription();
  MANY_ITEMS = 'SW_MANY_ITEMS';

  // dataSource = [{ id: 'language1', name: '', currentRate: this.newRating }];
  // languages = [{ languageName: '', languageRate: ''}];
  softwareArray = [];
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
    // this.id = localStorage.getItem('resumeId');
    this.route.params.subscribe((params)=>{
      this.sectionUniqueId = params['ids'];

      this.id = localStorage.getItem('resumeId');
      // this.form
      // .controls
      // .editor
      // .valueChanges.pipe(
      //   debounceTime(400),
      //   distinctUntilChanged()
      // )
      // .subscribe(data => {
      //   console.log('native fromControl value changes with debounce', data)
      // });
      this.userService.getResume(this.id).subscribe((res) => {
        this.userService.setCurrentTab(res, "section-software");
        this.onsoftwareUpdate(res)
        
      });
      this.userService.getSingleSection(this.sectionUniqueId)
      .subscribe((res) => {
          this.onSectionsoftwareUpdate(res['section'])
          console.log("recieved single section-----", res)
      });

    });
    console.log("sectionUniqueId",this.sectionUniqueId)
  }
  onsoftwareUpdate(res){
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    console.log("selectedSection", selectedSection);
    this.onSectionsoftwareUpdate(selectedSection || {})
  }

  onSectionsoftwareUpdate(res){
    this.sectionUniqueId = res['ids'] || "";
    this.sectionArray = res || [];
    this.softwareArray = res.subsections || [];
    console.log("softwareArray ", this.softwareArray)
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
    modalRef.componentInstance.softwareArray = this.softwareArray;
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.sub = this.sub;
    // modalRef.componentInstance.softwareform = this.softwareform;
    modalRef.componentInstance.temporaryArray = this.temporaryArray;
    modalRef.componentInstance.FormGroup = this.form;
    modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;
    modalRef.componentInstance.icons = this.icons;

    console.log("modalRef", modalRef);
    
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      
      console.log("receivedEntry", receivedEntry);
      this.onsoftwareUpdate(receivedEntry)
    })
  }
  
getLanguageNewId(){
  return 'software-' + this.softwareArray.length + 1;
}

  onAddData() {
    
    
    /*this.selectedsoftware = {
      ids : this.getLanguageNewId(),
      rate : this.softwareArray.length + 1,
      name : ''
     
    }
    this.edit = true;
    this.list = false;*/

    console.log("onAdd function called")
    this.selectedsoftware = {
      name: "",
      rate: this.softwareArray.length + 1
    }
    this.add = true;
    this.list = false;
    this.edit = false;
  }

  onDelete(index) {
    
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    this.softwareArray.splice(index, 1);
    console.log("language2",this.softwareArray)
    this.resumeIdArray.sections[sectionIndex].subsections = this.softwareArray;
    // console.log("resumeIdArray",this.resumeIdArray)

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      console.log(res)

      this.edit = false;
      this.list = true;
      // location.reload();
    });
  }

  onClone(SoftwareArray: any){
    /*this.selectedsoftware = this.softwareArray[index];
    this.selectedsoftware['ids'] = this.getLanguageNewId();
    this.softwareArray.push(this.selectedsoftware);
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    console.log("sectionIndex", sectionIndex);
    this.resumeIdArray.sections[sectionIndex].subsections = this.softwareArray;
    this.userService.updateresumegeneric( this.id,this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      this.edit = false;
      this.list = true;
    });*/

    console.log("Cloning-->", SoftwareArray);
    var tempSkills = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      name: SoftwareArray.name,
      rate: SoftwareArray.rate
    }
    this.softwareArray.push(tempSkills);

    let index = this.resumeIdArray.sections.findIndex((section) => {
      console.log("FIND INDEX", "sections", section.ids, "Section Unq id", this.sectionUniqueId)
      return section.ids == this.sectionUniqueId;
    });

    console.log("index", index, "resumeIdArray->", this.resumeIdArray, "this.sectionUniqueId", this.sectionUniqueId);
    this.resumeIdArray.sections[index].subsections = this.softwareArray;

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      console.log("AFTER CLONE", res);
      console.log(res)

      this.add = false;
      this.list = true;

    });
  }

  onSave(index) {
    console.log("ON SAVE")
    /*console.log("current rating ", this.currentRating);
    console.log("current name", this.name);
    // if(this.edit){
      let selectedIndex = this.softwareArray.findIndex(x => x.ids === this.selectedsoftware.ids);
      if(~selectedIndex){
        this.softwareArray[selectedIndex] = this.selectedsoftware;
      }else{
        this.softwareArray.push(this.selectedsoftware);
      }

   
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    console.log("sectionIndex", sectionIndex);
    this.resumeIdArray.sections[sectionIndex].subsections = this.softwareArray;
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
    console.log("on change", this.softwareArray)
  }

  onEdit(SoftwareArray: any){
    /*this.selectedsoftware = this.softwareArray[index];
    this.edit = true;
    this.list = false;*/
    console.log("inside edit", SoftwareArray)
    this.selectedsoftware = {
      ids: SoftwareArray.ids,
      name: SoftwareArray.name,
      rate: SoftwareArray.rate
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

  onSubmit(form: NgForm){
    console.log("ON LANG SUB--", form.value)
    var subsections = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      name: form.value.name,
      rate: this.selectedsoftware.rate
    }
    console.log("lanuageArray->", this.softwareArray, "subsections-->", subsections);
    // return;
    this.softwareArray.push(subsections);

    console.log("folioArray -->", this.softwareArray);
    console.log("this.resumeIdArray.sections", this.resumeIdArray.sections)
    let index = this.resumeIdArray.sections.findIndex((section) => {
      return section.ids == this.sectionUniqueId;
    })
    console.log("index", index);
    
    console.log("resumeIdArray->", this.resumeIdArray, "this.sectionUniqueId", this.sectionUniqueId);
    this.resumeIdArray.sections[index].subsections = this.softwareArray;

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      form.reset()
      this.add = false;
      this.list = true;
    });
  }

  onEditSubmit(form: NgForm) {
    console.log("Language edit", form.value, this.softwareArray);
    var subsections = {
      ids: form.value.ids,
      name: form.value.name,
      rate: this.selectedsoftware.rate
    }

    this.softwareArray.forEach(element => {
      // console.log(element)
      var index = this.softwareArray.findIndex(x => x.ids === form.value.ids);
      console.log("this is index-->", index)
      this.softwareArray.splice(index, 1, subsections);
    });

    let index = this.resumeIdArray.sections.findIndex((section) => {
      return section.ids == this.sectionUniqueId;
    })
    console.log("resumeIdArray->", this.resumeIdArray, "this.sectionUniqueId", this.sectionUniqueId);
    this.resumeIdArray.sections[index].subsections = this.softwareArray;

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
