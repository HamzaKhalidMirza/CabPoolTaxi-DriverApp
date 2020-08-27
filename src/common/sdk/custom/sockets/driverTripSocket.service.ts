import { AuthService } from "./../../core/auth.service";
import { Observable } from "rxjs/internal/Observable";
import { Injectable } from "@angular/core";
import { SocketIo } from "ng-io";
import { observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DriverTripSocket {
  constructor(private socket: SocketIo, private authService: AuthService) {}

  startTrip(trip, clients): Observable<any> {
    const startTripDataObs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);
        this.socket.emit("driverStartTrip", { trip, clients, driver: decodedToken.id });

        const startTripDataEvent = decodedToken.id + "-driverStartTripEvent";

        this.socket.on(startTripDataEvent, (data) => {
          observable.next(data);
        });
      });
    });

    return startTripDataObs;
  }

  trackTrip(trip, driver, location, clients) {
    this.socket.emit("driverTrackTrip", { trip, driver, location, clients });
  }

  driverArrival(data) {
    this.socket.emit("driverArrived", data);
  }

  driverPickup(data) {
    this.socket.emit("driverPickup", data);
  }

  driverDropoff(data): Observable<any> {
    this.socket.emit("driverDropoff", data);

    const obs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);

        const bookingEvent = decodedToken.id + "-bookingCompleted";

        this.socket.on(bookingEvent, (data) => {
          observable.next(data);
        });
      });
    });

    return obs;
  }

  rideCompleted(data): Observable<any> {
    this.socket.emit("driverRideCompleted", data);

    const obs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);

        const bookingEvent = decodedToken.id + "-rideCompleted";

        this.socket.on(bookingEvent, (data) => {
          observable.next(data);
        });
      });
    });

    return obs;
  }

  reportAdmin(data): Observable<any> {
    this.socket.emit("reportAdmin", data);

    const obs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);

        const event = decodedToken.id + "-adminReported";

        this.socket.on(event, (data) => {
          observable.next(data);
        });
      });
    });

    return obs;
  }

}
