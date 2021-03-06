import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComputerSkillsRoutingModule } from './computer-skills-routing.module';
import { ComputerSkillsComponent } from './computer-skills.component';

import { QuillModule } from 'ngx-quill'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({ exports:[
    TranslateModule
  ],
  declarations: [ComputerSkillsComponent],
  imports: [
    CommonModule,
    ComputerSkillsRoutingModule,
    QuillModule,
    FormsModule, 
    TranslateModule,
    ReactiveFormsModule,
    NgbModule
  ],
  entryComponents:[]
})
export class ComputerSkillsModule { }
