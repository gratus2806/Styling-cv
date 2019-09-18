import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditResumeRoutingModule } from './edit-resume-routing.module';
import { EditResumeComponent, SafePipe } from './edit-resume.component';
// import { SafePipe } from './safe.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {CustomizerComponent} from '../../shared/customizer/customizer.component';
import {SharedModule} from  '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    EditResumeRoutingModule,
    // SafePipe,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule
  ],
  declarations: [EditResumeComponent, SafePipe],
})
export class EditResumeModule { }
