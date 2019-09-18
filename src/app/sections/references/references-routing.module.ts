import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferencesComponent } from './references.component';

const routes: Routes = [
  {
    path: '',
     component: ReferencesComponent,
    data: {
      title: 'References'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferencesRoutingModule { }
