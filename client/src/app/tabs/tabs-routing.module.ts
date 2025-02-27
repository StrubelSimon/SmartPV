import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'battery',
        loadChildren: () => import('../battery/battery.module').then(m => m.BatteryPageModule)
      },
      {
        path: 'pv',
        loadChildren: () => import('../pv/pv.module').then(m => m.PVPageModule)
      },
      {
        path: 'load',
        loadChildren: () => import('../load/load.module').then(m => m.LoadPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/battery',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/battery',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
