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

import { DragulaService } from "ng2-dragula";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  //declarations
  courseArray: any;
  resumeIdArray;
  sectionArray;
  courseform;
  temporaryArray;
  title = 'Quill works!';
  hide = false;
  isReadOnly = false;
  form: FormGroup;
  public sub: any;
  public id: any;
  resumeId: {};
  sectionname;
  sectionicon;
  icons;
  sectionUniqueId;
  message: any;
  subscription: Subscription;
  subs = new Subscription();
  MANY_ITEMS = 'COURSE_MANY_ITEMS';

  course: Boolean = true;
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
  startDatesArr = [
    { id: 1, name: 'Help Desk' },
    { id: 2, name: 'HR' },
    { id: 3, name: 'IT' },
    { id: 4, name: 'Payroll' }
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
        this.userService.setCurrentTab(res, "section-courses");
        this.onCourseUpdate(res)

      });
      this.userService.getSingleSection(this.sectionUniqueId)
        .subscribe((res) => {
          this.onSectionCourseUpdate(res['section'])
          console.log("recieved single section-----", res)
        });
    });
  }
  onCourseUpdate(res) {
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section) => {
      return section.ids == this.sectionUniqueId;
    })
    console.log("selectedSection", selectedSection);
    this.onSectionCourseUpdate(selectedSection || {})
  }

  onSectionCourseUpdate(res) {
    this.sectionUniqueId = res['ids'] || "";
    this.sectionArray = res || [];
    this.courseArray = res.subsections || [];
    console.log("courseArray ", this.courseArray)
    this.sectionname = res.sectionname;
    this.sectionicon = res.icon;
    
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
    this.courseform = "";
    if (this.courseform == "") {
      this.courseform = {
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
    console.log("onSubmit function called")
    var subsections = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      about: form.value.about,
      name: form.value.name,
      opened: false,
      openHelp: false,
      speciality: form.value.speciality,
      start_time_MM: form.value.start_time_MM,
      start_time_YYYY: form.value.start_time_YYYY,
    }
    console.log("Subsection 1", subsections)

    this.courseArray.push(subsections)
    console.log("course array 1", this.courseArray)
    let index = this.resumeIdArray.sections.findIndex((section) => {
      return section.ids == this.sectionUniqueId;
    })
    this.resumeIdArray.sections[index].subsections = this.courseArray;


    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      form.reset()
      this.add = false;
      this.list = true;
    });
  }
  onEdit(courseArray: any) {
    console.log(courseArray)
    window.scrollTo(0, 0)
    this.courseform = {
      ids: courseArray.ids,
      company_url: courseArray.company_url,
      Country: courseArray.Country,
      about: courseArray.about,
      end_time_MM: courseArray.end_time_MM,
      end_time_YYYY: courseArray.end_time_YYYY,
      end_time_present: courseArray.end_time_present,
      name: courseArray.name,
      opened: courseArray.opened,
      speciality: courseArray.speciality,
      start_time_MM: courseArray.start_time_MM,
      start_time_YYYY: courseArray.start_time_YYYY

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
      opened: false,
      speciality: form.value.speciality,
      start_time_MM: form.value.start_time_MM,
      start_time_YYYY: form.value.start_time_YYYY,
    }

    this.courseArray.forEach(element => {
      // console.log(element)
      var index = this.courseArray.findIndex(x => x.ids === form.value.ids);
      console.log(index)
      this.courseArray.splice(index, 1, subsections);
    });

    let index = this.resumeIdArray.sections.findIndex((section) => {
      return section.ids == this.sectionUniqueId;
    })

    this.resumeIdArray.sections[index].subsections = this.courseArray;
    
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
    var index = this.courseArray.findIndex(x => x.ids === id);
    console.log(index)
    this.courseArray.splice(index, 1);
    this.resumeIdArray.sections[index].subsections = this.courseArray;

    // let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    // this.courseArray.splice(index, 1);
    // console.log("this.courseArray",this.courseArray)
    //  this.resumeIdArray.sections[sectionIndex].subsections =  this.courseArray;

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
  onClone(courseArray: any) {
    // console.log(this.courseArray)
    var temporaryArray = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      company_url: courseArray.company_url,
      about: courseArray.about,
      name: courseArray.name,
      opened: courseArray.opened,
      speciality: courseArray.speciality,
      start_time_MM: courseArray.start_time_MM,
      start_time_YYYY: courseArray.start_time_YYYY
    }
    this.courseArray.push(temporaryArray)
    // this.lanuageArray.push(this.selectedlanuage);
    let sectionIndex = this.resumeIdArray.sections.findIndex(x => x.ids === this.sectionUniqueId);
    console.log("sectionIndex", sectionIndex);
    this.resumeIdArray.sections[sectionIndex].subsections = this.courseArray;
    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
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
    modalRef.componentInstance.courseArray = this.courseArray;
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.sub = this.sub;
    modalRef.componentInstance.courseform = this.courseform;
    modalRef.componentInstance.temporaryArray = this.temporaryArray;
    modalRef.componentInstance.FormGroup = this.form;
    modalRef.componentInstance.sectionUniqueId = this.sectionUniqueId;
    modalRef.componentInstance.icons = this.icons;

    console.log("modalRef", modalRef);

    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {

      console.log("receivedEntry", receivedEntry);
      this.onCourseUpdate(receivedEntry)
    })
  }

  config = {
    toolbar : [
      ['bold', 'italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }, 'clean', 'link']
    ]
  }
}
