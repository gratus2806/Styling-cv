import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EducationRoutingModule } from './education-routing.module';
import { EducationComponent } from './education.component';

import { QuillModule } from 'ngx-quill'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DragulaModule } from  "ng2-dragula";
@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    EducationRoutingModule,
    QuillModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    NgbModule,
    DragulaModule
  ],
  declarations: [EducationComponent],
  entryComponents : []
})
export class EducationModule { }
