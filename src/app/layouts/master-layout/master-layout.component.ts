import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../shared/user.service';
import { GlobalService } from '../../shared/global.service';
import { Subscription } from 'rxjs';

var fireRefreshEventOnWindow = function () {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent('resize', true, false);
    window.dispatchEvent(evt);
};

@Component({
  selector: 'app-master-layout',
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.scss']
})


export class MasterLayoutComponent implements OnInit {

    options = {
        direction: 'ltr'
    };

    textDir;

    constructor(private elementRef: ElementRef, 
        public userService:UserService, 
        public globalService:GlobalService,
        private renderer: Renderer2,
        public translate: TranslateService) {
        
     }

     ngOnInit() {
        let language = localStorage.getItem('locale');
        this.languageChangedHandler(language);
        
        this.translate.use(language);
        if(language == "ar"){
            this.renderer.addClass(document.body, "langAR");
        }

        // //sidebar toggle event listner
        // this.elementRef.nativeElement.querySelector('#sidebarToggle')
        //     .addEventListener('click', this.onClick.bind(this));
        // //customizer events
        // this.elementRef.nativeElement.querySelector('#cz-compact-menu')
        //     .addEventListener('click', this.onClick.bind(this));
        // this.elementRef.nativeElement.querySelector('#cz-sidebar-width')
        //     .addEventListener('click', this.onClick.bind(this));
    }

    setDirection(language:any){
        if(language =='ar'){
            this.textDir = 'rtl';
        }else{
            this.textDir = 'ltr';
        }
        //this.translate.use(language);
    }
    languageChangedHandler(language:any){
        this.renderer.removeClass(document.body, 'classAR');
        if(language =='ar'){
            this.textDir = 'rtl';
            this.renderer.addClass(document.body, 'classAR');
        }else{
            this.textDir = 'ltr';
        }
    }
    onClick(event) {
        //initialize window resizer event on sidebar toggle click event
        setTimeout(() => { fireRefreshEventOnWindow() }, 300);
    }

    getOptions($event): void {
        this.options = $event;
    }

}