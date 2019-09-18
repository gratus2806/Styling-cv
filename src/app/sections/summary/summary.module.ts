import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary.component';
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
    SummaryRoutingModule,
    TranslateModule,
    QuillModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule
  ],
  declarations: [SummaryComponent]
})
export class SummaryModule { }
