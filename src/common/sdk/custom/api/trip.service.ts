import { AuthService } from 'src/common/sdk/core/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DriverAppConfig } from '../../../driver-app.config';

import { BadInput } from '../../../error/bad-input';
import { NotFoundError } from '../../../error/not-found-error';
import { AppError } from '../../../error/app-error';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UnAuthorized } from 'src/common/error/unauthorized-error';

@Injectable({
  providedIn: 'root'
})
export class TripService {
    
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public async createTrip(credentials: object) {
    const token = await this.authService.getTokenFromStorage();
    const decodedToken = this.authService.getDecodedAccessToken(token);
    const url = DriverAppConfig.getHostPath() + `/api/v1/drivers/${decodedToken.id}/trips`;

    return this.http.post(url, credentials, {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token),
      })
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public async getCurrentDriverAllTrips() {
    const token = await this.authService.getTokenFromStorage();
    const url = DriverAppConfig.getHostPath() + `/api/v1/trips/getCurrentDriverTrips`;

    return this.http.get(url, {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token),
      })
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public async getCurrentDriverSingleTrip(credentials) {
    const token = await this.authService.getTokenFromStorage();
    const url = DriverAppConfig.getHostPath() + `/api/v1/trips/getCurrentDriverTrip/${credentials.tripId}`;

    return this.http.get(url, {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token),
      })
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  private handleError(error: Response) {
    if (error.status === 400) {
      return throwError(new BadInput(error));
    }
    if (error.status === 404) {
      return throwError(new NotFoundError(error));
    }
    if (error.status === 401) {
      return throwError(new UnAuthorized(error));
    }
    return throwError(new AppError(error));
  }
}