import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmptySpaceComponent } from './empty-space.component';

const routes: Routes = [
  {
    path: '',
     component: EmptySpaceComponent,
    data: {
      title: 'Empty Space'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmptySpaceRoutingModule { }
