import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorldMapComponent } from './world-map.component';

const routes: Routes = [
  {
    path: '',
     component: WorldMapComponent,
    data: {
      title: 'World Map'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorldMapRoutingModule { }
