import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'
import { InterestsRoutingModule } from './interests-routing.module';
import { InterestsComponent } from './interests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    InterestsRoutingModule,
    QuillModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    NgbModule,
    DragulaModule
  ],
  declarations: [InterestsComponent],
  entryComponents:[]
})
export class InterestsModule { }
