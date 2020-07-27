import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/common/sdk/custom/api/request.service';
import {format} from "date-fns";
import { AppError } from "src/common/error/app-error";
import { BadInput } from "src/common/error/bad-input";
import { NotFoundError } from "src/common/error/not-found-error";
import { UnAuthorized } from "src/common/error/unauthorized-error";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {

  loadedRequests: any = [];
  relevantRequests: any = [];
  isLoading: any;

  constructor(private requestService: RequestService) {}

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.loadRequestData();
  }

  async loadRequestData() {
    this.isLoading = true;
    const createRequestObservable = await this.requestService.getCurrentDriverAllRequests();

    createRequestObservable.subscribe(
      async (response: any) => {
        this.isLoading = false;
        this.loadedRequests = response.data.data;
        console.log(this.loadedRequests);
        this.relevantRequests = this.loadedRequests.filter(
          (request) => request.status === "pending"
        );
        console.log("CO-Trips", this.relevantRequests);
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

  async acceptRequest(request) {
    this.isLoading = true;
    const acceptRequestObservable = await this.requestService.approvedRequest({
      id: request.id
    });

    acceptRequestObservable.subscribe(
      async (response: any) => {
        this.isLoading = false;
        await this.loadRequestData();
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

  async rejectRequest(request) {
    this.isLoading = true;
    const rejectRequestObservable = await this.requestService.rejectRequest({
      id: request.id
    });

    rejectRequestObservable.subscribe(
      async (response: any) => {
        this.isLoading = false;
        await this.loadRequestData();
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