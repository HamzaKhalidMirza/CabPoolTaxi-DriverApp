import { AuthService } from "./../../core/auth.service";
import { Observable } from "rxjs/internal/Observable";
import { Injectable } from "@angular/core";
import { SocketIo } from "ng-io";
import { observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatSocket {
  constructor(private socket: SocketIo, private authService: AuthService) {}

  sendMessage(data): Observable<any> {
    this.socket.emit("driverSendMessage", data);

    const chatMessageObs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);
        const chatMessageEvent =
          decodedToken.id + "-driverMessageSuccessfullySent";

        this.socket.on(chatMessageEvent, (data) => {
          observable.next(data);
        });
      });
    });

    return chatMessageObs;
  }

  receivedMessage(): Observable<any> {
    const chatObs = Observable.create(observable => {
      this.authService.getTokenFromStorage()
      .then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);
        const requestReceivedEvent = decodedToken.id + '-driverReceivedMessage';
    
        this.socket.on(requestReceivedEvent, (data) => {
          observable.next(data);
        });
      });
    });
    return chatObs;
  }

  getAllChatMessages(data): Observable<any> {
    this.socket.emit("driverQueriedChatMessages", data);

    const chatMessageObs = Observable.create((observable) => {
      this.authService.getTokenFromStorage().then((token) => {
        const decodedToken = this.authService.getDecodedAccessToken(token);
        const chatMessageEvent = decodedToken.id + "-driverGetChatMessages";

        this.socket.on(chatMessageEvent, (data) => {
          observable.next(data);
        });
      });
    });

    return chatMessageObs;
  }
}
