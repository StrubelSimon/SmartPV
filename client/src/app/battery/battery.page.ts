import { Component } from '@angular/core';
import { SocketService } from "src/services/socket.service";
import * as _ from 'lodash'

interface Battery {
  voltage: number
  voltageMin: number
  voltageMax: number
  current: number
  temperature: number
  percentage: number
  health: number
  charging: number
}

@Component({
  selector: 'SmartControl-Battery',
  templateUrl: 'battery.page.html',
  styleUrls: ['battery.page.scss'],
  standalone: false,
})
export class BatteryPage {

  private intervalId: any;
  public loading: boolean = true;
  public data!: Battery;

  constructor(private socketService: SocketService) {
  }

  ionViewWillEnter(): void {
    this.loading = true;
    this.setupInterval();
    this.loadData();
  }

  ionViewWillLeave(): void {
    this.destroyInterval()
  }

  loadData() {
    this.socketService.getMessages((data: Battery) => {
      this.data = data
      this.loading = false;
    });

  }

  setupInterval() {
    this.intervalId = setInterval(() => {
      this.socketService.sendMessage('battery');
    }, 1000);
  }

  destroyInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('⏹️ Interval gestoppt!');
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadData()
      this.loading = true;
    }, 500);
  }

}
