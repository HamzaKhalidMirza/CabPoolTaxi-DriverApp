import { TripService } from './../../../../common/sdk/custom/api/trip.service';
import { Component, OnInit } from '@angular/core';
import { AppError } from 'src/common/error/app-error';
import { BadInput } from 'src/common/error/bad-input';
import { NotFoundError } from 'src/common/error/not-found-error';
import { UnAuthorized } from 'src/common/error/unauthorized-error';
import {format} from "date-fns";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  loadedData: any = [];
  relevantData: any = [];
  isLoading: any;

  constructor(private tripService: TripService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.isLoading = true;
    const obs = await this.tripService.getCurrentDriverAllTrips();

    obs.subscribe(
      async (response: any) => {
        this.isLoading = false;
        this.loadedData = response.data.data;
        console.log(this.loadedData);
        this.relevantData = this.loadedData.filter(
          (trip) => trip.status === "complete"
        );
        console.log("CO-Trips", this.relevantData);
      },
      (error: AppError) => {
        this.isLoading = false;
        if (error instanceof BadInput) {
          console.log("error B", error);
        } else if (error instanceof NotFoundError) {
          console.log("error N", error);
        } else if (error instanceof UnAuthorized) {
          console.log("error U", error);
        } else {
          console.log("error", error);
        }
      }
    );
  }

  getPyament(trip) {
    let payment = 0;
    trip.booking.forEach(booking => {
      payment = payment + parseInt(booking.payment.totalPaid);
    });
    return payment;
  }

  getTotalEarning() {
    let payment = 0;
    this.relevantData.forEach(trip => {
      trip.booking.forEach(booking => {
        payment = payment + parseInt(booking.payment.totalPaid);
      });
    });
    return payment;
  }

  getTripDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: "long" });
  }

  getTripTime(dateStr) {
    var time = new Date(dateStr);
    return format(time, 'h:m a');
  }

  getTripDate(dateStr) {
    var time = new Date(dateStr);
    return format(time, 'dd-MM-yyyy');
  }
}
