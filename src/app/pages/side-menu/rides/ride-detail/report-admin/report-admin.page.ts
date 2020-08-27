import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DriverTripSocket } from './../../../../../../common/sdk/custom/sockets/driverTripSocket.service';
import { AuthService } from './../../../../../../common/sdk/core/auth.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";

@Component({
  selector: 'app-report-admin',
  templateUrl: './report-admin.page.html',
  styleUrls: ['./report-admin.page.scss'],
})
export class ReportAdminPage implements OnInit {

  loadedTrip: any;
  clients: any = [];
  formSubmit = false;
  form: FormGroup;
  isLoading: any;
  reportedClient: any;
  success: any;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private driverTripSocket: DriverTripSocket,
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.formInitializer();
  }

  formInitializer() {
    this.form = this.formBuilder.group({
      client: [ "", [ Validators.required ]],
      subject: [ "", [ Validators.required ]],
      message: [ "", [ Validators.required ]]
    });
    this.form.reset();
  }

  get client() {
    return this.form.get("client");
  }
  get subject() {
    return this.form.get("subject");
  }
  get message() {
    return this.form.get("message");
  }

  async ionViewWillEnter() {
    this.loadedTrip = await this.authService.getFieldDataFromStorage('report-loadedTrip')
    // await this.authService.clearFieldDataFromStorage('report-loadedTrip');

    if(this.loadedTrip) {
      this.loadedTrip.booking.forEach(booking => {
        this.clients.push(booking.client);        
      });
      console.log(this.clients);
    }
  }

  reportAdmin() {
    this.isLoading = true;
    this.formSubmit = true;

    if (this.form.invalid) {
      this.isLoading = false;
      return;
    }

    this.clients.forEach(client => {
      if(client.id === this.client.value) {
        this.reportedClient = client;
      }
    });

    const data = {
      reportedBy: 'driver',
      subject: this.subject.value,
      message: this.message.value,
      trip: this.loadedTrip.id,
      client: this.reportedClient.id,
      driver: this.loadedTrip.driver.id
    };

    this.driverTripSocket.reportAdmin(data)
      .subscribe(
        data => {
          this.isLoading = false;
          console.log(data);
          this.success = true;
          setTimeout(() => {
            this.navCtrl.pop()
            .then(() => {
              this.router.navigateByUrl('/tabs');
            })
            .catch(err => {
              console.log(err);
            });
          }, 3000);
        }, err => {
          this.isLoading = false;
          console.log(err);
        }
      );
  }

  goBack() {
    this.location.back();
  }

}
