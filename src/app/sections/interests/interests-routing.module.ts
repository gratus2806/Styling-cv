import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterestsComponent } from './interests.component';

const routes: Routes = [
  {
    path: '',
     component: InterestsComponent,
    data: {
      title: 'Interests'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterestsRoutingModule { }
