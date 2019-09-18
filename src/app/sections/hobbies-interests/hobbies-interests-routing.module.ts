import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HobbiesInterestsComponent } from './hobbies-interests.component';

const routes: Routes = [
  {
    path: '',
     component: HobbiesInterestsComponent,
    data: {
      title: 'Hobbies & Interests'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HobbiesInterestsRoutingModule { }
