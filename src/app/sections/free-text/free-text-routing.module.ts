import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FreeTextComponent } from './free-text.component';

const routes: Routes = [
  {
    path: '',
     component: FreeTextComponent,
    data: {
      title: 'Free Text'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FreeTextRoutingModule { }
