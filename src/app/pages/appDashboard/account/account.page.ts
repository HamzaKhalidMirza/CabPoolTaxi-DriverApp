import { AuthService } from './../../../../common/sdk/core/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  currentUser: any;

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUser();
    console.log(this.currentUser);
  }

}
