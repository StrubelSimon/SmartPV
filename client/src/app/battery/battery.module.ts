import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BatteryPage } from './battery.page';

import { BatteryPageRoutingModule } from './battery-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BatteryPageRoutingModule
  ],
  declarations: [BatteryPage]
})
export class BatteryPageModule { }
