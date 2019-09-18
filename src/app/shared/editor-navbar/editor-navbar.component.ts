import { Component, AfterViewChecked, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';
import { GlobalService } from '../global.service';
import {NgbdModalArrangeSections} from '../customizer/customizer.component';
import {NgbdModalTemplateLists} from '../customizer/customizer.component';
@Component({
    selector: 'app-editor-navbar',
    templateUrl: './editor-navbar.component.html',
    styleUrls: ['./editor-navbar.component.scss'],
    // providers: [NgbdModalArrangeSections]
   
})

export class EditorNavbarComponent {
 
    // gotoPreview(){
    //     console.log("gotoPreview called")
        
    // }
    resumeData;
    resumeId;
    @Output() languageChanged: EventEmitter<string> =   new EventEmitter();

    constructor(private router: Router, private modalService: NgbModal, private userService: UserService, private globalService: GlobalService){
    }

    ngOnInit(){
        
    }

    gotoPreview() {
        let user_id = 12;
        this.router.navigate(['/edit-resume', {id: user_id}]);
    }

    changeResumeTemplate(){

        const modalRef = this.modalService.open(NgbdModalTemplateLists,{size: 'lg', windowClass: 'modalTemplate'});
        this.userService.getTemplates().subscribe((res) => {
            modalRef.componentInstance.templates = res; 
            modalRef.componentInstance.resumeId = localStorage.getItem('resumeId');
            modalRef.componentInstance.templateSelected = localStorage.getItem('selected_template');
        });
    }

    arrangeSections(){
        const modalRef = this.modalService.open(NgbdModalArrangeSections,{size: 'lg', windowClass: 'modalArrange'}); 

        this.userService.getResume(localStorage.getItem('resumeId')).subscribe((res) => {
            modalRef.componentInstance.data = res['data'][0];
            //this.resumeData = res['data'][0]; 
        });
    }

    

    localeChangedHandler(language:any) {
        
        this.languageChanged.emit(language);
    }
}
