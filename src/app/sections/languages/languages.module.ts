import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguagesRoutingModule } from './languages-routing.module';
import { LanguagesComponent } from './languages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule } from 'ng2-dragula';
import { TranslateModule } from '@ngx-translate/core';
//import { RenameSectionComponent } from '../../common_modals/rename-section/rename-section.component';

@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    LanguagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    DragulaModule
    // BrowserModule
  ],
  declarations: [LanguagesComponent],
  entryComponents:[]
})
export class LanguagesModule { }
