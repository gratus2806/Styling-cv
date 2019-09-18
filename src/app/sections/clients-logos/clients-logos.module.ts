import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsLogosRoutingModule } from './clients-logos-routing.module';
import { ClientsLogosComponent } from './clients-logos.component';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../../shared/shared.module';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  imports: [
    CommonModule,
    ClientsLogosRoutingModule,
    QuillModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DragulaModule,
    SharedModule
  ],
  declarations: [ClientsLogosComponent]
})
export class ClientsLogosModule { }
