import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit, ɵConsole } from '@angular/core';
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
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  //declarations
  portfolioArray: any;
  resumeIdArray;
  sectionArray;
  portfolioform;
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
  message: any;
  subscription: Subscription;
  subs = new Subscription();
  MANY_ITEMS = 'PORTFOLIO_MANY_ITEMS';

  portfolio: Boolean = true;
  renamesection: Boolean = false;
  /** 
   * @folio stores data abt portfolio
   */
  folio: any;
  folioArray: any;

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
        this.userService.setCurrentTab(res, "section-portfolio");
        this.onPortfolioUpdate(res)

      });
      this.userService.getSingleSection(this.sectionUniqueId)
        .subscribe((res) => {
          this.onSectionPortfolioUpdate(res['section'])
          console.log("recieved single section-----", res)
        });
    });

    this.editor
      .onContentChanged
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(data => {
        console.log('view child + directly subscription', data)
      });
  }
  onPortfolioUpdate(res) {
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section) => {
      return section.ids == this.sectionUniqueId;
    })
    console.log("selectedSection", selectedSection);
    this.onSectionPortfolioUpdate(selectedSection || {})
  }

  onSectionPortfolioUpdate(res) {
    this.sectionUniqueId = res['ids'] || "";
    this.sectionArray = res || [];
    this.portfolioArray = res.subsections || [];
    console.log("PortfolioArray ", this.portfolioArray)
    this.sectionname = res.sectionname;
    
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

  onAdd() {
    console.log("onAdd function called")
    this.folio = {
      name: "",
      url: "",
      about: ""
    }
    this.add = true;
    this.list = false;
  }
  /**
   * add portfolio form
   * @param form form data
   */
  onSubmit(form: NgForm) {
    console.log("on submit", form.value)
    console.log("Skill form submitted", form.value)
    var subsections = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      name: form.value.name,
      url: form.value.url,
      about: form.value.about,
    }
    console.log("array", this.portfolioArray, "subsections-->", subsections);
    // return;
    this.portfolioArray.push(subsections);

    console.log("folioArray -->", this.portfolioArray);
    console.log("this.resumeIdArray.sections", this.resumeIdArray.sections)
    let index = this.resumeIdArray.sections.findIndex((section) => {
      return section.ids == this.sectionUniqueId;
    })
    console.log("index", index);
    
    console.log("resumeIdArray->", this.resumeIdArray, "this.sectionUniqueId", this.sectionUniqueId);
    this.resumeIdArray.sections[index].subsections = this.portfolioArray;

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      form.reset()
      this.add = false;
      this.list = true;
    });

  }

  onEditSubmit(form: NgForm) {
    console.log("Skill edit form", form.value);
    var subsections = {
      ids: form.value.ids,
      name: form.value.name,
      url: form.value.url,
      about: form.value.about,
    }

    this.portfolioArray.forEach(element => {
      // console.log(element)
      var index = this.portfolioArray.findIndex(x => x.ids === form.value.ids);
      console.log("this is index-->", index)
      this.portfolioArray.splice(index, 1, subsections);
    });

    let index = this.resumeIdArray.sections.findIndex((section) => {
      return section.ids == this.sectionUniqueId;
    })
    console.log("resumeIdArray->", this.resumeIdArray, "this.sectionUniqueId", this.sectionUniqueId);
    this.resumeIdArray.sections[index].subsections = this.portfolioArray;

    console.log("Editing resume ids-->", this.resumeIdArray);

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      console.log("updateresume", res);
      // form.reset()
      this.edit = false;
      this.list = true;
    });
  }

  onSave(data: any) {
    console.log("Edit called");

  }

  onEdit(PortFolioArray: any) {
    console.log("inside edit", PortFolioArray)
    this.folio = {
      ids: PortFolioArray.ids,
      name: PortFolioArray.name,
      url: PortFolioArray.url,
      about: PortFolioArray.about,
    }
    this.list = false;
    this.edit = true;
    this.add = false;
  }

  onClone(PortFolioArray: any) {
    console.log("Cloning-->", PortFolioArray);
    var tempSkills = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      name: PortFolioArray.name,
      url: PortFolioArray.url,
      about: PortFolioArray.about
    }
    this.portfolioArray.push(tempSkills);

    let index = this.resumeIdArray.sections.findIndex((section) => {
      console.log("FIND INDEX", "sections", section.ids, "Section Unq id", this.sectionUniqueId)
      return section.ids == this.sectionUniqueId;
    });

    console.log("index", index, "resumeIdArray->", this.resumeIdArray, "this.sectionUniqueId", this.sectionUniqueId);
    this.resumeIdArray.sections[index].subsections = this.portfolioArray;

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      console.log("AFTER CLONE", res);
      console.log(res)

      this.add = false;
      this.list = true;

    });

  }
  /**
   * delete subsection 
   * @param id 
   */
  onDelete(id: any) {
    console.log("skills subsection deleting")
    var index = this.portfolioArray.findIndex(x => x.ids === id);
    console.log(index)
    // console.log("BEFORE SPLICE skillsarray", this.portfolioArray, "resumeIdarray", this.resumeIdArray)
    this.portfolioArray.splice(index, 1);
    this.resumeIdArray.sections[index].subsections = this.portfolioArray;
    // console.log("AFTRE SPLICE portfolioArray", this.portfolioArray, "resumeIdarray", this.resumeIdArray)
    this.userService
      .updateresumegeneric(this.id, this.resumeIdArray)
      .subscribe((res: any) => {
        this.add = false;
        this.list = true;
        // location.reload();
      });
  }

  confirmCancelButton() {
    var data = this.resumeIdArray.sections;
    var index = data.findIndex(x => x.ids === this.sectionUniqueId);
    //  console.log(index)
    data.splice(index, 1);

    this.userService.updateresumegenericsubject(this.id, this.resumeIdArray).subscribe((res: any) => {
    });
    this.router.navigate(['/cv/', this.id, 'personal-info'], { relativeTo: this.route });
  }
  onCancel(){
    this.list = true;
    this.edit = false;
    this.add = false;
  }
}
