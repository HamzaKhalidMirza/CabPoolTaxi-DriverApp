import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeatsReservationPageRoutingModule } from './seats-reservation-routing.module';

import { SeatsReservationPage } from './seats-reservation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeatsReservationPageRoutingModule
  ],
  declarations: [SeatsReservationPage]
})
export class SeatsReservationPageModule {}
