import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkExperienceRoutingModule } from './work-experience-routing.module';
import { WorkExperienceComponent } from './work-experience.component';
import { QuillModule } from 'ngx-quill'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import * as alertFunctions from '../../shared/data/sweet-alerts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { TranslateModule } from '@ngx-translate/core';
//import { EditWorkExperienceModalComponent } from '../../common_modals/edit-work-experience-modal/edit-work-experience-modal.component';
 
@NgModule({
  exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    WorkExperienceRoutingModule,
    QuillModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    DragulaModule,
    TranslateModule
  ],
  declarations: [WorkExperienceComponent],
  entryComponents : []
})
 
export class WorkExperienceModule { 
    //  // Confirm & Cancel Button
    //  confirmCancelButton(){
    //   alertFunctions.confirmCancelButton();
    // }   
  
}
 