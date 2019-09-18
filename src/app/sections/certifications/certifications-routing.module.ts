import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificationsComponent } from './certifications.component';

const routes: Routes = [
  {
    path: '',
     component: CertificationsComponent,
    data: {
      title: 'Certifications'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificationsRoutingModule { }
