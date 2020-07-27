import { Router } from '@angular/router';
import { AuthService } from './../../../../../common/sdk/core/auth.service';
import { CurrentLocationService } from "./../../../../../common/sdk/custom/maps/currentLocation.service";
import { Component, OnInit } from "@angular/core";
import { LocationPickerModalComponent } from "../../shared/modals/location-picker-modal/location-picker-modal.component";
import { ModalController, AlertController } from "@ionic/angular";

@Component({
  selector: "app-trip-stops",
  templateUrl: "./trip-stops.page.html",
  styleUrls: ["./trip-stops.page.scss"],
})
export class TripStopsPage implements OnInit {
  stopsLocation = [];
  stops = [];
  center: any;
  tabBarElement: any;

  constructor(
    private modalCtrl: ModalController,
    private currentLocationService: CurrentLocationService,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.tabBarElement.style.display = 'none';

    this.center = await this.authService.getFieldDataFromStorage('center');
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  private showMapsErrorAlert() {
    this.alertCtrl
      .create({
        header: "Could not fetch location",
        buttons: ["Okay"],
      })
      .then((alertEl) => alertEl.present());
  }

  openLocationPickerModal() {
    this.modalCtrl
      .create({
        component: LocationPickerModalComponent,
        componentProps: {
          currentLocation: this.center,
          titleCaption: "Stop",
        },
      })
      .then((modalEl) => {
        modalEl.present();
        modalEl.onDidDismiss().then(async (locationData) => {
          if (locationData.data != null) {
            this.stopsLocation.push({
              location: locationData.data[0]
            });
          }
        });
      });
  }

  async continue() {
    if(this.stopsLocation) {
      this.stopsLocation.forEach(stop => {
        if(stop != null) {
          this.stops.push(stop);
        }
      });
  
      if(this.stops.length > 0) {
        let tripBookingData = await this.authService.getFieldDataFromStorage('trip-booking-data');
        tripBookingData.stops = [];
        this.stops.forEach(stop => {
          tripBookingData.stops.push({
            location: {
              address: stop.location.address,
              coordinates: [
                stop.location.lat,
                stop.location.lng
              ]
            }
          });
        });
        await this.authService.setFieldDataToStorage('trip-booking-data', tripBookingData);
      }  
    }
    this.routeToSeatsReservation()
  }

  routeToSeatsReservation() {
    this.router.navigateByUrl("/tabs/home/trip-stops/seats-reservation");
  }

  removeStop(index) {
    delete this.stopsLocation[index];
  }
}
