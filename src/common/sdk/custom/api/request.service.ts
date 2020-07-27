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
export class RequestService {
    
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public async getCurrentDriverAllRequests() {
    const token = await this.authService.getTokenFromStorage();
    const url = DriverAppConfig.getLocalPath() + `/api/v1/requests/getCurrentDriverRequests`;

    return this.http.get(url, {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token),
      })
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public async getCurrentDriverSingleRequest(credentials) {
    const token = await this.authService.getTokenFromStorage();
    const url = DriverAppConfig.getLocalPath() + `/api/v1/requests/${credentials.requestId}`;

    return this.http.get(url, {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token),
      })
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public async approvedRequest(credentials) {
    const token = await this.authService.getTokenFromStorage();
    const url = DriverAppConfig.getLocalPath() + `/api/v1/requests/approvedRequest/${credentials.id}`;

    return this.http.get(url, {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token),
      })
    .pipe(
      map((response: Response) => response),
      catchError(this.handleError)
    );
  }

  public async rejectRequest(credentials) {
    const token = await this.authService.getTokenFromStorage();
    const url = DriverAppConfig.getLocalPath() + `/api/v1/requests/rejectRequest/${credentials.id}`;

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