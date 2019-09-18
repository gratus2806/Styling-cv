import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoRoutingModule } from './personal-info-routing.module';
import { PersonalInfoComponent } from './personal-info.component';
import { Ng5SliderModule } from 'ng5-slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import {SharedModule} from '../../shared/shared.module';

@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    PersonalInfoRoutingModule,
    Ng5SliderModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    QuillModule,
    NgbModule,
    SharedModule
  ],
  declarations: [PersonalInfoComponent]
})
export class PersonalInfoModule { }


 

 
