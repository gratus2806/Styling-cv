import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkillsCompetencesRoutingModule } from './skills-competences-routing.module';
import { SkillsCompetencesComponent } from './skills-competences.component';
import { NouisliderModule } from 'ng2-nouislider';
import { QuillModule } from 'ngx-quill'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import { DragulaModule } from 'ng2-dragula';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    SkillsCompetencesRoutingModule,
    QuillModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    Ng5SliderModule,
    DragulaModule,
    NgbModule
  ],
  declarations: [SkillsCompetencesComponent]
})
export class SkillsCompetencesModule { }
