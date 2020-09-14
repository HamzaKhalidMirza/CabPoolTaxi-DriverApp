import { ModalController } from '@ionic/angular';
import { DriverTripSocket } from './../../../../common/sdk/custom/sockets/driverTripSocket.service';
import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { AuthService } from "src/common/sdk/core/auth.service";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";

@Component({
  selector: 'app-booking-submission',
  templateUrl: './booking-submission.component.html',
  styleUrls: ['./booking-submission.component.scss'],
})
export class BookingSubmissionComponent implements OnInit {

  @Input('currentLocation') currentLocation: any;
  @Input('driverTrack') driverTrack: any;
  form: FormGroup;
  formSubmit: any;
  ratingStar = 0;
  error: any;
  success: any;
  isLoading: any;
  
  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private driverTripSocket: DriverTripSocket,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.formInitializer();
  }

  formInitializer() {
    this.form = this.formBuilder.group({
      totalFare: [ "", [ Validators.required ]],
      totalPaid: [ "", [ Validators.required ]],
      rating: [ "" ],
      review: [ "" ]
    });

    this.form.patchValue({ totalFare: this.driverTrack.price });
  }

  get totalFare() {
    return this.form.get("totalFare");
  }

  get totalPaid() {
    return this.form.get("totalPaid");
  }

  get rating() {
    return this.form.get("rating");
  }

  get review() {
    return this.form.get("review");
  }

  logRatingChange(value) {
    this.ratingStar = value;
    this.form.patchValue({ rating: this.ratingStar });
  }

  submitBooking() {
    this.formSubmit = true;
    console.log(this.form);
    if(this.form.invalid) {
      this.error = 'Please fill the form correctly!';
      return;
    } 
    // else if(this.rating.value === '' && this.review.value !== '') {
    //   this.error = 'Please fille the rating with review!';
    //   return;
    // }

    this.isLoading = true;
    const driverTrack = this.driverTrack;
    const booking = driverTrack.booking;
    const payment = {
      method: 'cash',
      totalFare: this.totalFare.value,
      totalPaid: this.totalPaid.value
    };
    const review = {
      givenBy: 'driver',
      review: this.review.value,
      rating: this.rating.value,
      trip: driverTrack.trip,
      client: booking.client,
      driver: driverTrack.trip.driver
    }

    const data = {
      center: this.currentLocation,
      driverTrack,
      booking,
      payment,
      review,
      client: booking.client,
      trip: driverTrack.trip
    };

    console.log(data);
    
    this.driverTripSocket.driverDropoff(data)
      .subscribe(async (data) => {
        this.isLoading = false;
        console.log(data);
        this.success = true;
        setTimeout(() => {
          this.modalCtrl.dismiss({
            message: 'success'
          });
        }, 2000);
      }, err => {
        this.isLoading = false;
        console.log(err);
      });
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

}
