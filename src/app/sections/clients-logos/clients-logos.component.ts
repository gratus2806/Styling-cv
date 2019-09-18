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
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { data } from 'app/shared/data/smart-data-table';
import { subSeconds } from 'date-fns';

@Component({
  selector: 'app-clients-logos',
  templateUrl: './clients-logos.component.html',
  styleUrls: ['./clients-logos.component.scss'],
})
export class ClientsLogosComponent implements OnInit {
  //declarations
  clientlogoArray: any;
  resumeIdArray;
  sectionArray;
  clientlogoform;
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
  MANY_ITEMS = 'CLIENT_LOGOS_MANY_ITEMS';

  clientlogo: Boolean = true;
  renamesection: Boolean = false;
  apiUrl:any;

  startDatesArr = [
    { id: 1, name: 'Help Desk' },
    { id: 2, name: 'HR' },
    { id: 3, name: 'IT' },
    { id: 4, name: 'Payroll' }
  ];
  /**
   * @var data - for storing image data like default img data 
   */
  data: any;
  cropperSettings: CropperSettings;

  constructor(fb: FormBuilder, public userService: UserService, private route: ActivatedRoute, public router: Router, public modalService: NgbModal, dragulaService: DragulaService) {
    this.form = fb.group({
      editor: ['test']
    });
    // Settings For scropping
    this.cropLogoSettings();

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
    this.apiUrl = this.userService.getApiUrl();
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
        this.onClientLogoUpdate(res)

      });
      this.userService.getSingleSection(this.sectionUniqueId)
        .subscribe((res) => {
          this.onSectionClientLogoUpdate(res['section'])
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
  onClientLogoUpdate(res) {
    this.resumeIdArray = res.data ? res.data[0] : res.doc;
    let selectedSection = this.resumeIdArray.sections.find((section) => {
      return section.ids == this.sectionUniqueId;
    })
    console.log("selectedSection", selectedSection);
    this.onSectionClientLogoUpdate(selectedSection || {})
  }

  onSectionClientLogoUpdate(res) {
    this.sectionUniqueId = res['ids'] || "";
    this.sectionArray = res || [];
    this.clientlogoArray = res.subsections || [];
    console.log("clientlogoArray ", this.clientlogoArray)
    this.sectionname = res.sectionname;
    // console.log(this.educationArray)
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
  logo: any;
  edit = false;

  onAdd() {
    this.logo = {
      name: "",
      url: "",
      logo: ""
    }
    this.data.image = "";
    this.cropLogoSettings();
    this.add = true;
    this.list = false;
  }
  cropLogoSettings() {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 300;
    this.cropperSettings.height = 300;
    this.cropperSettings.croppedWidth = 300;
    this.cropperSettings.croppedHeight = 300;
    this.cropperSettings.canvasWidth = 500;
    this.cropperSettings.canvasHeight = 400;
    this.cropperSettings.noFileInput = true;

    this.data = { "image": "" };
  }

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  fileChangeListener($event) {
    
    this.cropLogoSettings();
    var image: any = new Image();
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      //that.data.image = image.src;
      that.logo.logo = image.src
      that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
  }

  onSubmit(form: NgForm) {
    var subsections = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      name: form.value.name,
      url: form.value.url,
      logo: this.data.image
    }
    this.clientlogoArray.push(subsections);

    let index = this.resumeIdArray.sections.findIndex((section) => {
      return section.ids == this.sectionUniqueId;
    })

    this.resumeIdArray.sections[index].subsections = this.clientlogoArray;

    this.userService.saveBase64File(subsections).subscribe((res: any) => {
      subsections.logo = this.apiUrl+res.folder+res.file_name;
      subsections['path'] = res.folder;
      this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
        // console.log("updateresume", res.doc._id);
        console.log(res)
        form.reset()
        this.add = false;
        this.list = true;
        this.data.image = this.apiUrl + subsections.logo;
      });
    });
  }

  onEdit(ClientLogoArray: any) {
    console.log(ClientLogoArray);
    this.logo = {
      ids: ClientLogoArray.ids,
      name: ClientLogoArray.name,
      url: ClientLogoArray.url,
      logo: ClientLogoArray.logo
    }
    this.data.image = this.logo.logo; 
    this.list = false;
    this.edit = true;
    this.add = false;
  }

  onClone(ClientLogoArray: any) {
    console.log("Cloning-->", ClientLogoArray);
    var tempSkills = {
      ids: Math.floor(10000000000 + Math.random() * 90000000000),
      name: ClientLogoArray.name,
      url: ClientLogoArray.url,
      logo: ClientLogoArray.logo
    }
    this.clientlogoArray.push(tempSkills);
    
    let index = this.resumeIdArray.sections.findIndex((section) => {
      
      return section.ids == this.sectionUniqueId;
    });

    
    this.resumeIdArray.sections[index].subsections = this.clientlogoArray;

    this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
      console.log("AFTER CLONE", res);
      console.log(res)

      this.add = false;
      this.list = true;

    });

  }

  onDelete(id: any) {
    console.log("skills subsection deleting")
    var index = this.clientlogoArray.findIndex(x => x.ids === id);
    console.log(index)
    // console.log("BEFORE SPLICE skillsarray", this.portfolioArray, "resumeIdarray", this.resumeIdArray)
    this.clientlogoArray.splice(index, 1);
    this.resumeIdArray.sections[index].subsections = this.clientlogoArray;
    // console.log("AFTRE SPLICE portfolioArray", this.portfolioArray, "resumeIdarray", this.resumeIdArray)
    this.userService
      .updateresumegeneric(this.id, this.resumeIdArray)
      .subscribe((res: any) => {
        this.add = false;
        this.list = true;
        // location.reload();
      });
  }

  onEditSubmit(form: NgForm) {
    console.log("form", form.value, this.data.image)
    var subsections = {
      ids: form.value.ids,
      name: form.value.name,
      url: form.value.url,
      logo: this.data.image // this is st in onEdit function
    }
    console.log("subsections", subsections);

    this.clientlogoArray.forEach(element => {
      var index = this.clientlogoArray.findIndex(x => x.ids === form.value.ids);
      this.clientlogoArray.splice(index, 1, subsections);
    });

    let index = this.resumeIdArray.sections.findIndex((section) => {
      return section.ids == this.sectionUniqueId;
    });

    this.resumeIdArray.sections[index].subsections = this.clientlogoArray;
    
    this.userService.saveBase64File(subsections).subscribe((res: any) => {
      
      if(res.code != 0){
        subsections.logo = this.apiUrl+res.folder+res.file_name;
        subsections['path'] = res.folder;
        this.data.image = this.apiUrl + subsections.logo;
      }else{
        subsections.logo = subsections.logo;
      }

      this.userService.updateresumegeneric(this.id, this.resumeIdArray).subscribe((res: any) => {
        console.log("updateresume", res);
        // form.reset()
        this.edit = false;
        this.list = true;
        
      });
    })
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

  onCancel() {
    this.list = true;
    this.edit = false;
    this.add = false;
  }

}
