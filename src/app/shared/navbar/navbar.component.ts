import { Component, AfterViewChecked, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements AfterViewChecked{
    ngOnInit() {
        let language = localStorage.getItem('locale');
        this.languageChangedHandler(language);
        // //sidebar toggle event listner
        // this.elementRef.nativeElement.querySelector('#sidebarToggle')
        //     .addEventListener('click', this.onClick.bind(this));
        // //customizer events
        // this.elementRef.nativeElement.querySelector('#cz-compact-menu')
        //     .addEventListener('click', this.onClick.bind(this));
        // this.elementRef.nativeElement.querySelector('#cz-sidebar-width')
        //     .addEventListener('click', this.onClick.bind(this));
    }
    textDir;
    languageChangedHandler(language:any){
       console.log("ssss");
        if(language =='ar'){
            this.textDir = 'rtl';
        }else{
            this.textDir = 'ltr';
        }

    }
    @Output() languageChanged: EventEmitter<string> =   new EventEmitter();

    localeChangedHandler(language:any) {
        console.log("sdfdfdf");
        if(language =='ar'){
            this.textDir = 'rtl';
        }else{
            this.textDir = 'ltr';
        }
        this.languageChanged.emit(language);
    }

    ngAfterViewChecked() {

 
        
    }
}
