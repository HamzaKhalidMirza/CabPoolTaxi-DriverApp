import { Observable } from "rxjs/internal/Observable";
import { TripService } from "./../../../../../../common/sdk/custom/api/trip.service";
import { Router } from "@angular/router";
import { AuthService } from "./../../../../../../common/sdk/core/auth.service";
import { Component, OnInit } from "@angular/core";
import { LoadingController, ToastController } from "@ionic/angular";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";

@Component({
  selector: "app-seats-reservation",
  templateUrl: "./seats-reservation.page.html",
  styleUrls: ["./seats-reservation.page.scss"],
})
export class SeatsReservationPage implements OnInit {
  seatsCounter: number = 1;
  viewNote: any;
  tabBarElement: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private tripService: TripService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.tabBarElement.style.display = 'none';
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }
  async continue() {
    let tripBookingData = await this.authService.getFieldDataFromStorage(
      "trip-booking-data"
    );
    tripBookingData.totalSeats = this.seatsCounter;
    tripBookingData.seatsAvailable = this.seatsCounter;
    if (this.viewNote) {
      tripBookingData.description = this.viewNote;
    }

    this.loadingCtrl
      .create()
      .then(async (loading) => {
        loading.present();

        const tripbookingObs = await this.tripService.createTrip(
          tripBookingData
        );
        tripbookingObs.subscribe(
          async (response) => {
            loading.dismiss();
            this.toastCtrl
              .create({
                message: "Trip Created successfully",
                duration: 3000,
                position: "bottom"
              })
              .then((toast) => {
                toast.present();
              })
              .catch((err) => {
                console.log(err);
              });

            this.seatsCounter = 1;
            this.viewNote = "";
            this.authService.clearFieldDataFromStorage("trip-booking-data");

            setTimeout(() => {
              this.router.navigateByUrl('/tabs');
            }, 3000);
          },
          (error: AppError) => {
            loading.dismiss();
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
      })
      .catch((err) => {
        this.loadingCtrl.dismiss();
        console.log(err);
      });
  }

  incrementSeat() {
    if (this.seatsCounter === 4) {
      return;
    }
    this.seatsCounter++;
  }

  decrementSeat() {
    if (this.seatsCounter === 1) {
      return;
    }
    this.seatsCounter--;
  }
}
