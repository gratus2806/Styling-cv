import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'
import { HobbiesRoutingModule } from './hobbies-routing.module';
import { HobbiesComponent } from './hobbies.component';
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
    HobbiesRoutingModule,
    QuillModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    DragulaModule
  ],
  declarations: [HobbiesComponent],
  entryComponents:[]
})
export class HobbiesModule { }
