import { Component } from '@angular/core';
import { SocketService } from "src/services/socket.service";

interface Load {
  voltage: number
  current: number,
  power: number,
  status: number
}

@Component({
  selector: 'SmartControl-Load',
  templateUrl: 'load.page.html',
  styleUrls: ['load.page.scss'],
  standalone: false,
})
export class LoadPage {

  private intervalId: any;
  public data!: Load;
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

    this.socketService.getMessages((data: Load) => {
      this.data = data
      this.loading = false;
    });

  }

  setupInterval() {
    this.intervalId = setInterval(() => {
      this.socketService.sendMessage('load');
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
