import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmptySpaceRoutingModule } from './empty-space-routing.module';
import { EmptySpaceComponent } from './empty-space.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    TranslateModule,
    EmptySpaceRoutingModule
  ],
  declarations: [EmptySpaceComponent]
})
export class EmptySpaceModule { }
