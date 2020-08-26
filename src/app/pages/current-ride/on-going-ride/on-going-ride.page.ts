import { BookingSubmissionComponent } from './../booking-submission/booking-submission.component';
import { Router } from "@angular/router";
import { DriverTripSocket } from "./../../../../common/sdk/custom/sockets/driverTripSocket.service";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from "@angular/core";
import { Subscription } from "rxjs";
import { BaseMapService } from "src/common/sdk/custom/maps/baseMap.service";
import { CurrentLocationService } from "src/common/sdk/custom/maps/currentLocation.service";
import { AuthService } from "src/common/sdk/core/auth.service";
import { AlertController, ModalController, ToastController } from "@ionic/angular";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import { ScheduleOnGoingTripService } from "src/common/sdk/custom/others/scheduleOnGoingTrip.service";
import { Location } from '@angular/common';
import {  NavController } from '@ionic/angular';

@Component({
  selector: "app-on-going-ride",
  templateUrl: "./on-going-ride.page.html",
  styleUrls: ["./on-going-ride.page.scss"],
})
export class OnGoingRidePage implements OnInit {
  @ViewChild("map") mapEl: ElementRef;
  googleMapsSdk: any;
  directionsService: any;
  directionsDisplay: any;
  map: any;
  marker: any;
  center: any;
  currentLocationObs: Subscription;
  driverSocketObs: Subscription;
  tripSourceLocation: any;
  tripDestLocation: any;
  isLoading: any;
  loadedTrip: any;
  bookingTrips: any = [];
  clients: any = [];
  driver: any;
  vehicle: any;
  scheduledBookings: any = [];
  trackInterval: any;

  constructor(
    private baseMapService: BaseMapService,
    private renderer: Renderer2,
    private currentLocationService: CurrentLocationService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private driverTripSocket: DriverTripSocket,
    private scheduleOnGoingTripService: ScheduleOnGoingTripService,
    private location: Location,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {}

  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.isLoading = true;
    await this.createMap();
    await this.getCurrentTripData();
    this.trackCurrentLocation();
  }
  ionViewDidEnter() {
    console.log("ionViewDidEnter");
  }
  ionViewWillLeave() {
    console.log("ionViewWillLeave");
  }
  ionViewDidLeave() {
    console.log("ionViewDidLeave");
    clearInterval(this.trackInterval);
    this.currentLocationObs.unsubscribe();
    if (this.driverSocketObs) {
      this.driverSocketObs.unsubscribe();
    }
  }
  ngOnDestroy() {
    console.log("ngOnDestroy");
  }

  createMap() {
    console.log("On-Going-Ride");
    this.currentLocationObs = this.currentLocationService
      .trackCurrentLocation()
      .subscribe(
        (location) => {
          this.center = location;
          this.baseMapService
            .getGoogleMapsSdk()
            .then((googleMapsSdk: any) => {
              this.googleMapsSdk = googleMapsSdk;
              const mapEl = this.mapEl.nativeElement;

              if(this.map) {
                this.map.panTo(this.center);
                this.marker.setPosition(this.center);
              } else {
                const map = new googleMapsSdk.Map(mapEl, {
                  center: location,
                  zoom: 18,
                  disableDefaultUI: true,
                  scaleControl: true,
                  mapTypeId: "roadmap",
                });
                this.map = map;
  
                googleMapsSdk.event.addListenerOnce(map, "idle", () => {
                  this.renderer.addClass(mapEl, "visible");
                });
  
                this.marker = new googleMapsSdk.Marker({
                  position: location,
                  icon: "assets/icon/car.png",
                  map: map,
                });  
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
        (err) => {
          console.log(err);
          this.showMapsErrorAlert();
        }
      );
  }

  async getCurrentTripData() {
    const trip = await this.authService.getFieldDataFromStorage(
      "on-going-trip"
    );
    const startTrip = await this.authService.getFieldDataFromStorage(
      "start-on-going-trip"
    );

    if (trip) {
      this.loadedTrip = trip;
      this.driver = this.loadedTrip.driver;
      this.vehicle = this.loadedTrip.vehicle;
      this.tripSourceLocation = {
        lat: this.loadedTrip.startLocation.coordinates[0],
        lng: this.loadedTrip.startLocation.coordinates[1],
        address: this.loadedTrip.startLocation.address,
      };
      this.tripDestLocation = {
        lat: this.loadedTrip.endLocation.coordinates[0],
        lng: this.loadedTrip.endLocation.coordinates[1],
        address: this.loadedTrip.endLocation.address,
      };

      if (this.loadedTrip.booking.length > 0) {
        this.bookingTrips = this.loadedTrip.booking;
        this.bookingTrips.forEach((booking) => {
          this.clients.push(booking.client);
        });
      }

      if (startTrip) {
        await this.notifyClientsAboutStartTrip();
      } else {
        this.isLoading = false;
        this.scheduledBookings = this.scheduleOnGoingTripService.ScheduledBookings;
      }
    }
  }

  async notifyClientsAboutStartTrip() {
    this.driverSocketObs = await this.driverTripSocket
      .startTrip(this.loadedTrip, this.clients)
      .subscribe(async (data) => {
        this.isLoading = false;
        this.loadedTrip = data;
        this.driver = this.loadedTrip.driver;
        this.vehicle = this.loadedTrip.vehicle;
        this.tripSourceLocation = {
          lat: this.loadedTrip.startLocation.coordinates[0],
          lng: this.loadedTrip.startLocation.coordinates[1],
          address: this.loadedTrip.startLocation.address,
        };
        this.tripDestLocation = {
          lat: this.loadedTrip.endLocation.coordinates[0],
          lng: this.loadedTrip.endLocation.coordinates[1],
          address: this.loadedTrip.endLocation.address,
        };

        if (this.loadedTrip.booking.length > 0) {
          this.bookingTrips = this.loadedTrip.booking;
          this.bookingTrips.forEach((booking) => {
            this.clients.push(booking.client);
          });
        }

        this.scheduledBookings = this.scheduleOnGoingTripService.scheduleTripBooking(
          this.center,
          this.bookingTrips,
          this.loadedTrip
        );
        console.log(this.scheduledBookings);
      });
  }

  trackCurrentLocation() {
    if (this.clients && this.center) {
      this.trackInterval = setInterval(() => {
        this.driverTripSocket.trackTrip(
          this.loadedTrip, this.driver, this.center, this.clients
        );
      }, 600);
    }
  }

  driverArrived(booking) {
    booking.arrival = true;
    this.driverTripSocket.driverArrival({
      client: booking.booking.client,
      trip: this.loadedTrip
    });
  }

  async driverPickupUp(booking) {
    booking.pickup = true;
    booking.booking.startLocation.coordinates = [this.center.lat, this.center.lng];
    console.log(this.scheduledBookings);
    let bookings = this.scheduledBookings;
    this.scheduledBookings = [];
    this.scheduledBookings = await this.scheduleOnGoingTripService.rescheduleBookings(
      this.center,
      bookings
    );
    console.log(this.scheduledBookings);

    this.driverTripSocket.driverPickup({
      client: booking.booking.client,
      trip: this.loadedTrip,
      center: this.center
    });
  }

  driverDropoff(booking) {
    this.alertCtrl
      .create({
        header: "Confirm!",
        message: 'Are you sure the ride is completed!!!',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Confirm',
            handler: () => {
              this.handleBooking(booking);
            }
          }
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  async handleBooking(booking) {
    booking.dropoff = true;
    booking.booking.endLocation.coordinates = [this.center.lat, this.center.lng];

    let bookings = this.scheduledBookings;
    this.scheduledBookings = [];
    this.scheduledBookings = await this.scheduleOnGoingTripService.rescheduleBookings(
      this.center,
      bookings
    );

    booking.distance = this.scheduleOnGoingTripService.getDistanceThroughCoordinates(
      booking.booking.startLocation.lat,
      booking.booking.startLocation.lng,
      booking.booking.endLocation.lat,
      booking.booking.endLocation.lng,
      "K"
    );
    booking.price = this.scheduleOnGoingTripService.getBookingPrice(
      this.vehicle, 12, booking.distance);

    console.log(booking);

    this.modalCtrl
    .create({
      component: BookingSubmissionComponent,
      componentProps: {
        currentLocation: this.center,
        driverTrack: booking
      }
    })
    .then((modalEl) => {
      modalEl.present();
      modalEl.onDidDismiss().then(async (data) => {
        if(data.data != null) {
          console.log(data);
        } else {
          booking.dropoff = false;
        }
      });
    });
  }

  completeRide() {
    this.scheduledBookings.forEach(booking => {
      if(booking.dropoff === false) {
        this.alertCtrl
        .create({
          header: "Alert",
          message: 'Please finish the trip first.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              }
            }
          ]
        })
        .then((alertEl) => alertEl.present());
        return;
      }
    });

    this.driverTripSocket.rideCompleted({
      trip: this.loadedTrip
    }).subscribe(
      data => {
        console.log(data);
        this.toastCtrl
        .create({
          message: "Trip Completed successfully",
          duration: 3000,
          position: "bottom"
        })
        .then((toast) => {
          toast.present();
        })
        .catch((err) => {
          console.log(err);
        });

        setTimeout(() => {
          this.navCtrl.pop()
            .then(() => {
              this.scheduleOnGoingTripService.scheduledBookings = [];
              this.router.navigateByUrl('/tabs');
            })
            .catch(err => {
              console.log(err);
            });
        }, 3000);
      }, err => {
        console.log(err);
      }
    );
  }

  async openChatRoom(booking) {
    console.log(booking);

    await this.authService.clearFieldDataFromStorage("chat-clientData");
    await this.authService.setFieldDataToStorage(
      "chat-clientData",
      booking.client
    );

    this.router.navigateByUrl("chat-room");
  }

  private showMapsErrorAlert() {
    this.alertCtrl
      .create({
        header: "Could not fetch location",
        buttons: ["Okay"],
      })
      .then((alertEl) => alertEl.present());
  }

  goBack() {
    this.location.back();
  }
}
