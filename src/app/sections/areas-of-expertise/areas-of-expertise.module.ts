import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { AreasOfExpertiseRoutingModule } from './areas-of-expertise-routing.module';
import {AreasOfExpertiseComponent } from './areas-of-expertise.component';
import { QuillModule } from 'ngx-quill'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    AreasOfExpertiseRoutingModule,
    QuillModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule, TranslateModule,
    DragulaModule
  ],
  declarations: [AreasOfExpertiseComponent],
  entryComponents : []
})
export class AreasOfExpertiseModule { }
