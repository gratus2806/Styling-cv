import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsLogosComponent } from './clients-logos.component';

const routes: Routes = [
  {
    path: '',
     component: ClientsLogosComponent,
    data: {
      title: 'Clients Logos'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsLogosRoutingModule { }
