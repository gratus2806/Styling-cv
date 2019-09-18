import { Component, OnInit } from '@angular/core';
import { NouiFormatter } from "ng2-nouislider";
import { Options } from 'ng5-slider';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, Params, NavigationExtras } from "@angular/router";
import { UserService } from '../../shared/user.service';
import { debounceTime,  distinctUntilChanged} from 'rxjs/operators';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RenameModalComponent  } from '../../common_modals/rename_modal/rename-modal.component';
@Component({
  selector: 'app-skills-competences',
  templateUrl: './skills-competences.component.html',
  styleUrls: ['./skills-competences.component.scss']
})
export class SkillsCompetencesComponent implements OnInit {
  skills;
  skillsArray : any;
  resumeIdArray;
  sectionArray;
  form: FormGroup;
  public id: any;
  resumeId: {};
  sectionname;
  sectionicon;
  icons;
  sectionUniqueId;
  message:any;
  subscription: Subscription;
  subs = new Subscription();
  MANY_ITEMS = 'SKILLS_MANY_ITEMS';

  constructor(public modalService: NgbModal,fb: FormBuilder, public userService: UserService, private route: ActivatedRoute, public router: Router, public dragulaService: DragulaService) {
    this.form = fb.group({
      editor: ['test']
    });

    if(!dragulaService.find("SKILLS_MANY_ITEMS")){
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
      if(element['name'] == this.sectionname){
        element.subsections = sourceModel;
      }
    });
    
    this.userService.updateresumegenericsubject(this.id,this.resumeIdArray).subscribe((res : any) => {
    });
  })
);
this.subs.add(dragulaService.removeModel(this.MANY_ITEMS)
  .subscribe(({ el, source, item, sourceModel }) => {
  })
  
);

  this.subscription = this.userService.getMessage().subscribe(message => { this.message = message; 
  });
}

  ngOnInit() {
    this.route.params.subscribe((params)=>{
      this.sectionUniqueId = params['ids'];

      this.id = localStorage.getItem('resumeId');
      console.log("resume id--", this.id)
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
          this.userService.setCurrentTab(res, "section-skills");
          this. onSkillUpdate(res)
          
        });
        this.userService.getSingleSection(this.sectionUniqueId)
        .subscribe((res) => {
            this.onSectionSkillUpdate(res['section'])
            console.log("recieved single section-----", res)
        });
    });
  }
  value: number = 5;
  options: Options = {
    showTicksValues: true,
    stepsArray: [
      {value: 1, legend: 'Very poor'},
      {value: 2},
      {value: 3, legend: 'Fair'},
      {value: 4},
      {value: 5, legend: 'Average'},
      {value: 6},
      {value: 7, legend: 'Good'},
      {value: 8},
      {value: 9},
      {value: 10, legend: 'Excellent'}
    ]
  };

   //events ends
   add = false;
   list = true;
   edit = false;

  onAdd(){
    this.skills = "";
    if(this.skills == ""){
      this.skills = {
        ids: "",
        name: "",
        opened: false,
        proficiency: 0,
         
      }
    }

    console.log("onAdd function called");
    this.add = true;
    this.list = false;
  }

  onSkillDelete(id: string){
    console.log("On Skill Delete")
  }

  onSkillSave(){
    console.log("On Skill Save")
  
  }

  onSkillSubmit(form : NgForm) {
    console.log("Skill form submitted", form.value)
    var subsections = {
      ids : Math.floor(10000000000 + Math.random() * 90000000000),
      name : form.value.name,
      proficiency : form.value.strength,
      opened: false,
    }

    this.skillsArray.push(subsections);

    console.log("skills array", this.skillsArray);
    
    let index = this.resumeIdArray.sections.findIndex((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    console.log("resumeIdArray->", this.resumeIdArray, "this.sectionUniqueId", this.sectionUniqueId);
    this.resumeIdArray.sections[index].subsections = this.skillsArray;
    
    this.userService.updateresumegeneric(this.id,  this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      form.reset()
      this.add = false;
      this.list = true;
    });
  }
  // when already skill is edited
  onSkillEditSubmit(form : NgForm){
    console.log("Skill edit form", form.value);
    var subsections = {
      ids : form.value.ids,
      name : form.value.name,
      proficiency : form.value.strength,
      opened: false,
    }

    this.skillsArray.forEach(element => {
      // console.log(element)
      var index = this.skillsArray.findIndex(x => x.ids === form.value.ids);
      console.log("this is index--",index)
      this.skillsArray.splice(index, 1, subsections);
    });
    
    let index = this.resumeIdArray.sections.findIndex((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    console.log("resumeIdArray->", this.resumeIdArray, "this.sectionUniqueId", this.sectionUniqueId);
    this.resumeIdArray.sections[index].subsections = this.skillsArray;

    console.log("Editing resume ids-->", this.resumeIdArray);
    
    this.userService.updateresumegeneric(this.id,this.resumeIdArray).subscribe((res : any) => {
      console.log("updateresume", res);
      // console.log(res)
      // form.reset()
      this.edit = false;
      this.list = true;
      // this.value = form.value.strength;
      // location.reload();
    });

  }

  onSkillUpdate(res){
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section)=>{
      return section.ids== this.sectionUniqueId;
    })
    console.log("skill update", selectedSection);
    this.onSectionSkillUpdate(selectedSection || {})
  }

  onSectionSkillUpdate(res){
    this.sectionUniqueId = res['ids'] || "";
    this.sectionArray = res || [];
    console.log("Skill array update ", res.subsections)
    this.skillsArray = res.subsections || [];
    console.log("Skill arrray ", this.skillsArray)
    this.sectionname = res.sectionname ;
    this.sectionicon = res.icon;
  }

onEdit(SkillsArray : any){
  console.log("Edit called", SkillsArray);
  // return;
  this.skills = {
    ids: SkillsArray.ids,
    name: SkillsArray.name,
    opened: SkillsArray.opened,
    proficiency: SkillsArray.proficiency
  }
  console.log("SKILLS--->", this.skills)
  // return;
  this.list = false;
  this.add = false;
  this.edit = true;
}

onClone(SkillsArray: any){
  console.log("Edit called", SkillsArray);
  var tempSkills = {
    ids: Math.floor(10000000000 + Math.random() * 90000000000),
    name: SkillsArray.name,
    opened: SkillsArray.opened,
    proficiency: SkillsArray.proficiency
  }
  this.skillsArray.push(tempSkills);
  
  let index = this.resumeIdArray.sections.findIndex((section)=>{
    return section.ids== this.sectionUniqueId;
  })
  console.log("resumeIdArray->", this.resumeIdArray, "this.sectionUniqueId", this.sectionUniqueId);
  this.resumeIdArray.sections[index].subsections = this.skillsArray;

  this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
    console.log("AFTER CLONE", res);
    console.log(res)

    this.add = false;
    this.list = true;
  
  });

}

onDelete(id: string){
  console.log("skills subsection deleting")
  var index = this.skillsArray.findIndex(x => x.ids === id);
    console.log(index)
    console.log("BEFORE SPLICE skillsarray", this.skillsArray, "resumeIdarray", this.resumeIdArray)
    this.skillsArray.splice(index, 1);
    this.resumeIdArray.sections[index].subsections = this.skillsArray;
    console.log("AFTRE SPLICE skillsarray", this.skillsArray, "resumeIdarray", this.resumeIdArray)
    this.userService
      .updateresumegeneric(this.id, this.resumeIdArray)
      .subscribe((res: any) => {

        this.add = false;
        this.list = true;
      // location.reload();
    });
}
// Delete main section 
confirmCancelButton(){
  console.log("")
  var data = this.resumeIdArray.sections;
  var index = data.findIndex(x => x.ids === this.sectionUniqueId);
 //  console.log(index)
  data.splice(index, 1);
 
  this.userService.updateresumegenericsubject(this.id,this.resumeIdArray).subscribe((res : any) => {
 });
 this.router.navigate(['/cv/',this.id,'personal-info'], { relativeTo: this.route });
 //  this.router.navigateByUrl('/personal-info');
}
editWorkexpErience() {
  // this.modalService.open(content, { size: 'lg' });
  const modalRef = this.modalService.open(RenameModalComponent);
  modalRef.componentInstance.sectionname = this.sectionname;
  modalRef.componentInstance.sectionicon = this.sectionicon;
  modalRef.componentInstance.sectionArray = this.sectionArray;
  modalRef.componentInstance.resumeIdArray = this.resumeIdArray;
  modalRef.componentInstance.skillsArray = this.skillsArray;
  modalRef.componentInstance.id = this.id;
  // modalRef.componentInstance.sub = this.sub;
  // modalRef.componentInstance.skillsform = this.skillsform;
  // modalRef.componentInstance.temporaryArray = this.temporaryArray;
  modalRef.componentInstance.FormGroup = this.form;
  modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;

  console.log("modalRef", modalRef);
  
  modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
    
    console.log("receivedEntry", receivedEntry);
    this.onSkillUpdate(receivedEntry)
  })
 
}





}
