import { Component } from '@angular/core';
import { SocketService } from "src/services/socket.service";


interface PV {
  voltage: number
  current: number,
  power: number,
  status: number
}


@Component({
  selector: 'SmartControl-PV',
  templateUrl: 'pv.page.html',
  styleUrls: ['pv.page.scss'],
  standalone: false,
})
export class PVPage {

  private intervalId: any;
  public data!: PV;
  public loading: boolean = true;

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

    this.socketService.getMessages((data: PV) => {
      this.data = data
      this.loading = false;
    });

  }

  setupInterval() {
    this.intervalId = setInterval(() => {
      this.socketService.sendMessage('pv');
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
