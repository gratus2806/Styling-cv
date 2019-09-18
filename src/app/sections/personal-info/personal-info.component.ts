import { Component, OnInit, ViewChild} from '@angular/core';
import { Options } from 'ng5-slider';
import {ActivatedRoute, Router, Params,NavigationExtras } from "@angular/router";
import { UserService } from '../../shared/user.service';
import { GlobalService } from '../../shared/global.service';
 import { FormBuilder, FormGroup, Validators,FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { ImageCropperComponent, CropperSettings} from 'ngx-img-cropper';


@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {
  
  public personalItems:Array<Object> = [
  
  ];

  logo: any;

  onAdd() {
    this.logo = {
      name: "",
      url: "",
      logo: ""
    }
    this.data.image = "";
    this.cropLogoSettings();
    //this.add = true;
    //this.list = false;
  }

  constructor(public router: Router, private route : ActivatedRoute,private userService: UserService, private globalService: GlobalService) { }

  public sub: any;
  public id :any;
  resumeIdArray ;
  personalInfoArray ;

  cropperSettings: CropperSettings;
  data: any;
  apiUrl:any;

  logoUrl:any;

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  ngOnInit() {
    this.apiUrl = this.userService.getApiUrl();
    localStorage.setItem("currentTab", '-1');
    this.personalItems=[
      {
        Letsstartwithyourheader:'Let’s start with your header',
        name1     :'Include your 1st and last name and at least one way for employers to reach you',
        PersonalInfo:'Personal Info',
        AddPhoto:'Add Photo',
        NinjaDeveloper:'Ninja Developer',
        FirstName:'First Name',
        LastName:'Last Name',
        ProfessionalTitle:'Professional Title',
        name2:'e.g. Business Development Manager',
        EmailAddress:'Email Address',
        Nationality:'Nationality',
        MaritalStatus:'Marital Status',
        ContactInfomation:'Contact Infomation',
        PhoneNumber:'Phone Number',
        Address:'Address',
        username:'@username',

      }
    ];


  this.id = localStorage.getItem('resumeId');
  this.cropLogoSettings();
  this.userService.getResume(this.id).subscribe((res) => {
    this.resumeIdArray = res['data'][0];
    this.personalInfoArray = res['data'][0].meta;
    
    this.data.image = this.apiUrl + this.personalInfoArray.aboutSection.image._Xlarge; 
    this.logoUrl = this.apiUrl + 'upload/sections/personal-logos/' + this.personalInfoArray.aboutSection.image._Xlarge;
    this.globalService.emitPersonalInfo(this.personalInfoArray);
    if(res['data'][0].sections.length > 0){
      var nextTab = res['data'][0].sections[0]['path']
      
    }
  });

  }

  personalChange(newValue) {
    this.userService.updateresumegeneric(this.id,this.resumeIdArray).subscribe((res : any) => {
      
      this.globalService.emitPersonalInfo(res['doc'].meta);
    });
  } 
  
  fileChangeListener($event) {
    
    this.cropLogoSettings();
    var image: any = new Image();
    var file: File = $event.target.files[0];

    var myReader: FileReader = new FileReader();
    var that = this;
    that.data.fileName = file.name;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      //that.data.image = image.src;
      //that.logo.logo = image.src
      that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);

    
  }

  

  cropLogoSettings() {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 300;
    this.cropperSettings.height = 300;
    this.cropperSettings.croppedWidth = 300;
    this.cropperSettings.croppedHeight = 300;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.noFileInput = true;
    this.data = { "image": "", "fileName": "", id: this.id, token: Math.floor(10000000000 + Math.random() * 90000000000) };
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
      {value: 9, legend: 'Excellent'}
    ]
  };

  onEditSubmit(formData){
    console.log("onEditSubmit--->", formData);
  }

  saveLogo(){
    console.log(this.data);
    this.userService.saveBase64PersonalLogo(this.data).subscribe((res: any) => {
      let file_name = res.file_name;
      let id = this.id;

      let data ={
        file_name: file_name,
        id: id
      }

      this.userService.updatePersonalLogo(data).subscribe((res: any) => {
        
      });
    });
  }
}
