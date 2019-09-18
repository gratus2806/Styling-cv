import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntroductionRoutingModule } from './introduction-routing.module';
import {IntroductionComponent} from './introduction.component';

import { QuillModule } from 'ngx-quill'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
   exports:[
    TranslateModule
  ],
  declarations: [IntroductionComponent],
  imports: [
    CommonModule,
    IntroductionRoutingModule,
    QuillModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class IntroductionModule { }
