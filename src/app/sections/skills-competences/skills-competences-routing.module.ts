import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SkillsCompetencesComponent } from './skills-competences.component';

const routes: Routes = [
  {
    path: '',
     component: SkillsCompetencesComponent,
    data: {
      title: 'Skill & Competences'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsCompetencesRoutingModule { }
