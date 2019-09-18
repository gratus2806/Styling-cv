import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferencesRoutingModule } from './references-routing.module';
import { ReferencesComponent } from './references.component';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DragulaModule } from "ng2-dragula";
@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    
    CommonModule,
    ReferencesRoutingModule,
    QuillModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule
  ],
  declarations: [ReferencesComponent],
  entryComponents:[]
})
export class ReferencesModule { }
