import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ScheduleOnGoingTripService {
  scheduledBookings: any = [];

  constructor() {}

  public get ScheduledBookings() {
    return this.scheduledBookings;
  }

  public scheduleTripBooking(center, bookingTrips, loadedTrip) {
    for (let i = 0; i < bookingTrips.length; i++) {
      let schedule = {
        id: null,
        arrival: false,
        pickup: false,
        dropoff: false,
        distance: null,
        booking: null,
        trip: loadedTrip,
      };

      const distance = this.getDistanceThroughCoordinates(
        center.lat,
        center.lng,
        bookingTrips[i].startLocation.coordinates[0],
        bookingTrips[i].startLocation.coordinates[1],
        "K"
      );

      schedule.id = bookingTrips[i].id;
      schedule.booking = bookingTrips[i];
      schedule.distance = distance;

      this.scheduledBookings.push(schedule);
    }

    if (this.scheduledBookings.length === 0) {
      return this.scheduledBookings;
    } else {
      this.insertionSort(this.scheduledBookings, this.scheduledBookings.length);
      return this.scheduledBookings;
    }
  }

  rescheduleBookings(center, bookingTrips) {
    this.scheduledBookings = [];
    for (let i = 0; i < bookingTrips.length; i++) {

      let distance = null;
      if(bookingTrips[i].dropoff) {
        distance = 10000;  
      } else if(bookingTrips[i].pickup) {
        distance = this.getDistanceThroughCoordinates(
          center.lat,
          center.lng,
          bookingTrips[i].booking.endLocation.coordinates[0],
          bookingTrips[i].booking.endLocation.coordinates[1],
          "K"
        );
      } else {
        distance = this.getDistanceThroughCoordinates(
          center.lat,
          center.lng,
          bookingTrips[i].booking.startLocation.coordinates[0],
          bookingTrips[i].booking.startLocation.coordinates[1],
          "K"
        );
      }
      
      bookingTrips[i].distance = distance;

      this.scheduledBookings.push(bookingTrips[i]);
    }

    if (this.scheduledBookings.length === 0) {
      return this.scheduledBookings;
    } else {
      this.insertionSort(this.scheduledBookings, this.scheduledBookings.length);
      return this.scheduledBookings;
    }
  }

  private insertionSort(arr, n) {
    let i, key, j;
    for (i = 1; i < n; i++) {
      key = arr[i];
      j = i - 1;

      while (j >= 0 && arr[j].distance > key.distance) {
        arr[j + 1] = arr[j];
        j = j - 1;
      }
      arr[j + 1] = key;
    }
    this.scheduledBookings = arr;
  }

  getDistanceThroughCoordinates(lat1, lon1, lat2, lon2, unit) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

  getBookingPrice(vehicle, baseFare, distance) {

    const vehicleBaseFare = vehicle.type === 'moto' ? 3 : 2;
    const price = distance * baseFare * vehicleBaseFare;

    return price;
  }
}
