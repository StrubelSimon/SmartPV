import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatteryPage } from './battery.page';

const routes: Routes = [
  {
    path: '',
    component: BatteryPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatteryPageRoutingModule { }
