import { RequestService } from "./../../../../common/sdk/custom/api/request.service";
import { AuthService } from "./../../../../common/sdk/core/auth.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage implements OnInit {
  isRequestReceived: boolean;

  constructor(private requestService: RequestService) {}

  ngOnInit() {}
  async ionViewWillEnter() {
    this.requestService.requestReceived().subscribe((data) => {
      console.log("2", data);
    });
    setInterval( () => {
      this.requestService.getIsRequestReceived().subscribe((data) => {
        this.isRequestReceived = data;
      });  
    },200);
  }
}
