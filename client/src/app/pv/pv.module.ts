import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PVPage } from './pv.page';

import { PvPageRoutingModule } from './pv-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PvPageRoutingModule
  ],
  declarations: [PVPage]
})
export class PVPageModule { }
