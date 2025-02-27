import { Component } from '@angular/core';
import { SocketService } from "src/services/socket.service";
import { SwUpdateService } from 'src/services/sw-update.service'
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(public platform: Platform, public swUpdateService: SwUpdateService) {

  }

  async ngOnInit() {
    await this.platform?.ready();
    this.swUpdateService.checkForUpdates();
  }

}
