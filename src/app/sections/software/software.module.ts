import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftwareRoutingModule } from './software-routing.module';
import { SoftwareComponent } from './software.component';
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
    SoftwareRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    DragulaModule
  ],
  declarations: [SoftwareComponent],
  entryComponents:[]
})
export class SoftwareModule { }
