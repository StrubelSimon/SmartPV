import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadPage } from './load.page';

import { LoadPageRoutingModule } from './load-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LoadPageRoutingModule
  ],
  declarations: [LoadPage]
})
export class LoadPageModule { }
