import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripStopsPage } from './trip-stops.page';

const routes: Routes = [
  {
    path: '',
    component: TripStopsPage
  },
  {
    path: 'seats-reservation',
    loadChildren: () => import('./seats-reservation/seats-reservation.module').then( m => m.SeatsReservationPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripStopsPageRoutingModule {}
