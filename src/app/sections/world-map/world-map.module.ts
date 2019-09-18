import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { WorldMapRoutingModule } from './world-map-routing.module';
import { WorldMapComponent } from './world-map.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
   exports:[
    TranslateModule
  ],
  imports: [
    CommonModule,
    WorldMapRoutingModule,
    TranslateModule,
    AgmCoreModule
  ],
  declarations: [WorldMapComponent]
})
export class WorldMapModule { }
