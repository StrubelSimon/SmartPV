import { Injectable } from '@angular/core';
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket!: WebSocket;
  private serverUrl = environment.socketUrl + "/ws"; // Deine ESP32 WebSocket-IP

  constructor() {
    this.connect();
  }

  private connect() {
    console.log(this.serverUrl);
    this.socket = new WebSocket(this.serverUrl);

    this.socket.onopen = () => {
      console.log('✅ WebSocket verbunden!');
    };

    this.socket.onclose = () => {
      console.warn('❌ WebSocket getrennt, versuche Reconnect...');
      setTimeout(() => this.connect(), 3000); // Automatischer Reconnect
    };

    this.socket.onerror = (error) => {
      console.error('⚠️ WebSocket Fehler:', error);
    };
  }

  sendMessage(message: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn('⛔ WebSocket nicht verbunden!');
    }
  }

  getMessages(callback: (data: any) => void) {
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // JSON parsen
        callback(data);
      } catch (error) {
        console.error('❌ Fehler beim JSON-Parsen:', error, event.data);
      }
    };
  }

}
