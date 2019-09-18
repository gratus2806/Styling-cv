import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertificationsRoutingModule } from './certifications-routing.module';
import { CertificationsComponent } from './certifications.component';

import { QuillModule } from 'ngx-quill'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DragulaModule } from "ng2-dragula";

@NgModule({ 
  exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    CertificationsRoutingModule,
    QuillModule,
    FormsModule,
     TranslateModule,
    ReactiveFormsModule,
    NgbModule,
    DragulaModule
  ],
  declarations: [CertificationsComponent],
  entryComponents:[]
})
export class CertificationsModule { }
