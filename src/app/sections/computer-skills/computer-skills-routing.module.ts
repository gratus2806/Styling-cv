import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ComputerSkillsComponent} from './computer-skills.component';

const routes: Routes = [
  {
    path: '',
     component: ComputerSkillsComponent,
    data: {
      title: 'Computer Skills'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComputerSkillsRoutingModule { }
