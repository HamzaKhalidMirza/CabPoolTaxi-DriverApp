import { Router } from '@angular/router';
import { AuthService } from 'src/common/sdk/core/auth.service';
import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/common/sdk/custom/api/trip.service';
import {format} from "date-fns";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";

@Component({
  selector: 'app-rides',
  templateUrl: './rides.page.html',
  styleUrls: ['./rides.page.scss'],
})
export class RidesPage implements OnInit {

  loadedTrips: any = [];
  relevantTrips: any = [];
  isLoading: any;

  constructor(
    private tripService: TripService,
    private authService: AuthService,
    private router: Router
    ) {}

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.isLoading = true;
    const createTripObservable = await this.tripService.getCurrentDriverAllTrips();

    createTripObservable.subscribe(
      async (response: any) => {
        this.isLoading = false;
        this.loadedTrips = response.data.data;
        console.log(this.loadedTrips);
        this.relevantTrips = this.loadedTrips.filter(
          (trip) => trip.status === "upcoming" || trip.status === "current"
        );
        console.log("CO-Trips", this.relevantTrips);
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

  async startRide(trip, e) {
    e.stopPropagation();
    await this.authService.clearFieldDataFromStorage('on-going-trip');
    await this.authService.setFieldDataToStorage('on-going-trip', trip);
    await this.authService.clearFieldDataFromStorage('start-on-going-trip');
    await this.authService.setFieldDataToStorage('start-on-going-trip', true);
    this.router.navigateByUrl('/on-going-ride');
  }

  async currentRide(trip, e) {
    e.stopPropagation();
    await this.authService.clearFieldDataFromStorage('on-going-trip');
    await this.authService.setFieldDataToStorage('on-going-trip', trip);
    await this.authService.clearFieldDataFromStorage('start-on-going-trip');
    this.router.navigateByUrl('/on-going-ride');
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
