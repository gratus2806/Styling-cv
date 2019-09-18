import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AreasOfExpertiseComponent} from './areas-of-expertise.component';

const routes: Routes = [
  {
  path: '',
   component: AreasOfExpertiseComponent,
  data: {
    title: 'Areas of Expertise'
  },
  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreasOfExpertiseRoutingModule { }
