import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HobbiesComponent } from './hobbies.component';

const routes: Routes = [
  {
    path: '',
     component: HobbiesComponent,
    data: {
      title: 'Hobbies'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HobbiesRoutingModule { }
