import { AlertController } from '@ionic/angular';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CurrentLocationService {
  constructor(
    private alertCtrl: AlertController
  ) {}

  public getCurrentLocation(): Observable<any> {
    let locationObs = Observable.create((observable) => {
      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          const location = {
            lat: geoPosition.coords.latitude,
            lng: geoPosition.coords.longitude,
          };

          observable.next(location);
        },
        (err) => {
          console.log(err);
          this.alertCtrl
          .create({
            header: "Could not fetch location",
            buttons: ["Okay"],
          })
          .then((alertEl) => alertEl.present());    
        },
        {maximumAge:600000, timeout:600000, enableHighAccuracy:true}
      );
    });

    return locationObs;
  }

  public trackCurrentLocation(): Observable<any> {
    let locationObs = Observable.create((observable) => {
      navigator.geolocation.watchPosition(
        (geoPosition) => {
          const location = {
            lat: geoPosition.coords.latitude,
            lng: geoPosition.coords.longitude,
          };

          observable.next(location);
        },
        (err) => {
          console.log(err);
        },
        {maximumAge:600000, timeout:600000, enableHighAccuracy:true}
      );
    });

    return locationObs;
  }
}
