import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { UserService } from '../../shared/user.service';
import {ActivatedRoute, Router} from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DragulaService } from 'ng2-dragula';
export {FormBuilder}
@Component({
  selector: 'app-rename-modal',
  templateUrl: './rename-modal.component.html',
  styleUrls: ['./rename-modal.component.scss']
})
export class RenameModalComponent  {
  public menuItems = [];
  public sectiondynamicArray : any[];
  public sections = []  ;
  public sub: any;
  public id :any;
  public icons ;
  public iconsArray = ["fa-home","fa-office","fa-pencil","fa-droplet","fa-camera","fa-tape"];
  @Input() sectionname;
  @Input() sectionArray;
  @Input() sectionicon;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
 
  constructor(public router: Router,public userService : UserService,public activeModal: NgbActiveModal,public route: ActivatedRoute, public translate: TranslateService,public modalService: NgbModal,public fb: FormBuilder,public dragulaService: DragulaService) {
    console.log("controller called")
  }

  sectionrename(event){
    console.log("event", this.sectionname)
  }


  savesection(icon,sectionname,id,sectionArray,resumeIdArray){
    console.log(icon,sectionname,id)
    sectionArray.icon = icon
    sectionArray.sectionname = sectionname;

    console.log("sectionArray", sectionArray)
    let index = resumeIdArray.sections.findIndex(x => x.ids === sectionArray.ids)
    console.log("index", index)

    resumeIdArray.sections.splice(index, 1, sectionArray)
    console.log("resumeIdArray",resumeIdArray);
    this.userService.updateresumegenericsubject(id,resumeIdArray).subscribe((res : any) => {
      console.log("modal section",res)
      this.passEntry.emit(res); 
    });
    this.activeModal.close();
  }

  iconschangeFunction(id,data,sectionArray,resumeIdArray){
    sectionArray.icon = data
    this.icons =  sectionArray.icon;
    console.log(id)
    console.log(sectionArray)
    console.log(data)
    console.log(resumeIdArray)
    

    this.sectionicon = sectionArray.icon
    console.log('section icon',this.sectionicon);
    console.log(this.icons)
    console.log(sectionArray.sectionname);
  }

}
