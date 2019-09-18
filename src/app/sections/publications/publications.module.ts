import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicationsRoutingModule } from './publications-routing.module';
import { PublicationsComponent } from './publications.component';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    PublicationsRoutingModule,
    TranslateModule,
    QuillModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [PublicationsComponent]
})
export class PublicationsModule { }
