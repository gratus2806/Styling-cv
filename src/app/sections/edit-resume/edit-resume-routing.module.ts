import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditResumeComponent} from './edit-resume.component'
const routes: Routes = [
  {
  path: '',
   component: EditResumeComponent,
  data: {
    title: 'Edit Resume'
  },
  
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditResumeRoutingModule { }
