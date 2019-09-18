import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AwardsRoutingModule } from './awards-routing.module';
import { AwardsComponent } from './awards.component';
import { QuillModule } from 'ngx-quill'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from "ng2-dragula";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    AwardsRoutingModule,
    QuillModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
     TranslateModule,
    DragulaModule
  ],
  declarations: [AwardsComponent],
  entryComponents:[]
})
export class AwardsModule { }
