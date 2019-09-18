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
import { DragulaService } from "ng2-dragula";
import { RenameSectionComponent } from '../../common_modals/rename-section/rename-section.component';

import { Subscription } from 'rxjs';
@Component({
  selector: 'app-awards',
  templateUrl: './awards.component.html',
  styleUrls: ['./awards.component.scss']
})
export class AwardsComponent implements OnInit {
  //declarations
  awardsArray: any;
  resumeIdArray;
  sectionArray;
  awardsform;
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
  message: any;
  subscription: Subscription;
  subs = new Subscription();
  MANY_ITEMS = 'MANY_ITEMS';
  icons;
  awards: Boolean = true;
  renamesection: Boolean = false;
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
  public year: Array<Object> = [
    { id: 0, name: "Dont't Show" }
  ];
  constructor(fb: FormBuilder, public userService: UserService, private route: ActivatedRoute, public router: Router, public modalService: NgbModal, public dragulaService: DragulaService) {
    this.form = fb.group({
      editor: ['test']
    });
    if (!dragulaService.find("MANY_ITEMS")) {
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
  @ViewChild('editor') editor: QuillEditorComponent

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.sectionUniqueId = params['ids'];
      console.log('updatedParams ->', this.sectionUniqueId);
      var i, j;
      for (i = "1967", j = "1"; i <= "2022"; i++ , j++) {
        this.year.push({ id: j, name: i })
      }
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
        this.userService.setCurrentTab(res, "section-awards");
        this.onawardsUpdate(res)

      });
      this.userService.getSingleSection(this.sectionUniqueId)
        .subscribe((res) => {
          this.onSectionawardsUpdate(res['section'])
          console.log("reciev single section-----", res)
        });
    });
  }
  onawardsUpdate(res) {
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section) => {
      return section.ids == this.sectionUniqueId;
    })
    console.log("selectedSection", selectedSection);
    this.onSectionawardsUpdate(selectedSection || {})
  }

  onSectionawardsUpdate(res) {
    this.sectionUniqueId = res['ids'] || "";
    this.sectionArray = res || [];
    this.awardsArray = res.subsections || [];
    console.log("awardsArray ", this.awardsArray)
    this.sectionname = res.sectionname;
    this.sectionicon = res.icon;
    
  }
  editWorkexpErience() {
    // this.modalService.open(content, { size: 'lg' });
    const modalRef = this.modalService.open(RenameSectionComponent);
    modalRef.componentInstance.sectionname = this.sectionname;
    modalRef.componentInstance.sectionicon = this.sectionicon;
    modalRef.componentInstance.sectionArray = this.sectionArray;
    modalRef.componentInstance.resumeIdArray = this.resumeIdArray;
    modalRef.componentInstance.awardsArray = this.awardsArray;
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.sub = this.sub;
    modalRef.componentInstance.awardsform = this.awardsform;
    modalRef.componentInstance.temporaryArray = this.temporaryArray;
    modalRef.componentInstance.FormGroup = this.form;
    modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;
    modalRef.componentInstance.icons = this.icons;

    console.log("modalRef", modalRef);

    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {

      console.log("receivedEntry", receivedEntry);
      this.onawardsUpdate(receivedEntry)
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

  onAdd(id: string) {
    this.awardsform = "";
    if (this.awardsform == "") {
      this.awardsform = {
        start_time_MM: "Select Month",
        start_time_YYYY: "Select Year",
        about: ""
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
    console.log("onSubmit function called", form.value)
    var subsections = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      about: form.value.about,
      name: form.value.name,
      opened: false,
      openHelp: false,
      authority: form.value.authority,
      url: form.value.url,
      start_time_MM: form.value.start_time_MM,
      start_time_YYYY: form.value.start_time_YYYY,
    }
    console.log("Subsection 1", subsections)

    this.awardsArray.push(subsections)
    console.log("awards array 1", this.awardsArray)
    let index = this.resumeIdArray.sections.findIndex((section) => {
      return section.ids == this.sectionUniqueId;
    })
    this.resumeIdArray.sections[index].subsections = this.awardsArray;


    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      form.reset()
      this.add = false;
      this.list = true;
    });
  }
  onEdit(awardsArray: any) {
    console.log(awardsArray)
    window.scrollTo(0, 0)
    this.awardsform = {
      ids: awardsArray.ids,
      company_url: awardsArray.company_url,
      Country: awardsArray.Country,
      about: awardsArray.about,
      end_time_MM: awardsArray.end_time_MM,
      end_time_YYYY: awardsArray.end_time_YYYY,
      end_time_present: awardsArray.end_time_present,
      url: awardsArray.url,
      name: awardsArray.name,
      opened: awardsArray.opened,
      authority: awardsArray.authority,
      start_time_MM: awardsArray.start_time_MM,
      start_time_YYYY: awardsArray.start_time_YYYY

    }
    this.add = false;
    this.list = false;
    this.edit = true;
    window.scrollTo(0, 0)

  }

  onEditSubmit(form: NgForm) {
    console.log("subsecton", subsections);
    var subsections = {

      ids: form.value.ids,
      company_url: "",
      about: form.value.about,
      name: form.value.name,
      authority: form.value.authority,
      opened: false,
      speciality: form.value.speciality,
      url: form.value.url,
      start_time_MM: form.value.start_time_MM,
      start_time_YYYY: form.value.start_time_YYYY,
    }

    this.awardsArray.forEach(element => {
      // console.log(element)
      var index = this.awardsArray.findIndex(x => x.ids === form.value.ids);
      console.log(index)
      this.awardsArray.splice(index, 1, subsections);
    });

    let index = this.resumeIdArray.sections.findIndex((section) => {
      return section.ids == this.sectionUniqueId;
    })

    this.resumeIdArray.sections[index].subsections = this.awardsArray;
    
    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      form.reset()
      this.edit = false;
      this.list = true;
      // location.reload();
    });
  }
  onCancel() {
    this.list = true;
    this.edit = false;
    this.add = false;
  }
  onDelete(id: String) {


    // console.log(index)
    // let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    // this.awardsArray.splice(index, 1);
    // var index = this.awardsArray.findIndex(x => x.ids === id);
    // console.log("this.awardsArray",this.awardsArray)
    //  this.resumeIdArray.sections[sectionIndex].subsections =  this.awardsArray;

    var index = this.awardsArray.findIndex(x => x.ids === id);

    this.awardsArray.splice(index, 1);
    this.resumeIdArray.sections[index].subsections = this.awardsArray;

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)

      this.add = false;
      this.list = true;
      // location.reload();
    });

  }
  confirmCancelButton() {
    // console.log(this.resumeIdArray)
    // console.log(this.sectionUniqueId)
    var data = this.resumeIdArray.sections;
    var index = data.findIndex(x => x.ids === this.sectionUniqueId);
    //  console.log(index)
    data.splice(index, 1);

    this.userService.updateresumegenericsubject(this.id, this.resumeIdArray).subscribe((res: any) => {
    });
    this.router.navigate(['/cv/', this.id, 'personal-info'], { relativeTo: this.route });
    //  this.router.navigateByUrl('/personal-info');

    //  data.forEach(element => {
    //   // console.log(element)
    //   if(element['name'] == "Work Experience"){
    //    console.log("hello enbter")

    //   }
    // });

  }
  onClone(awardsArray: any) {
    // console.log(this.awardsArray)
    var temporaryArray = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      company_url: awardsArray.company_url,
      about: awardsArray.about,
      name: awardsArray.name,
      opened: awardsArray.opened,
      authority: awardsArray.authority,
      url: awardsArray.url,
      start_time_MM: awardsArray.start_time_MM,
      start_time_YYYY: awardsArray.start_time_YYYY
    }
    this.awardsArray.push(temporaryArray)
    // this.lanuageArray.push(this.selectedlanuage);
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    console.log("sectionIndex", sectionIndex);
    this.resumeIdArray.sections[sectionIndex].subsections = this.awardsArray;
    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      this.edit = false;
      this.list = true;
    });
  }

  config = {
    toolbar : [
      ['bold', 'italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }, 'clean', 'link']
    ]
  }
}
