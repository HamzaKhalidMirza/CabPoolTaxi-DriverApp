import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripStopsPageRoutingModule } from './trip-stops-routing.module';

import { TripStopsPage } from './trip-stops.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripStopsPageRoutingModule
  ],
  declarations: [TripStopsPage]
})
export class TripStopsPageModule {}
