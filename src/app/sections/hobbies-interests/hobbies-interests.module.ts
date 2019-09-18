import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HobbiesInterestsRoutingModule } from './hobbies-interests-routing.module';
import { HobbiesInterestsComponent } from './hobbies-interests.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    TranslateModule,
    HobbiesInterestsRoutingModule
  ],
  declarations: [HobbiesInterestsComponent]
})
export class HobbiesInterestsModule { }
