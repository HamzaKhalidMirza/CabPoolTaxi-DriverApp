import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeatsReservationPage } from './seats-reservation.page';

const routes: Routes = [
  {
    path: '',
    component: SeatsReservationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeatsReservationPageRoutingModule {}
