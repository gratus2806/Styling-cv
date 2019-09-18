import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FreeTextRoutingModule } from './free-text-routing.module';
import { FreeTextComponent } from './free-text.component';
import { QuillModule } from 'ngx-quill'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    FreeTextRoutingModule,
    QuillModule,
    NgbModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [FreeTextComponent]
})
export class FreeTextModule { }
