import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
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
    CoursesRoutingModule,
    QuillModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DragulaModule
  ],
  declarations: [CoursesComponent],
  entryComponents : []
})
export class CoursesModule { }
