import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:[
        { path: 'tab1', loadChildren: '../home/home.module#HomePageModule' },
        { path: 'tab2', loadChildren: '../profile/profile.module#ProfilePageModule' },
        { path: 'tab3', loadChildren: '../voucher/voucher.module#VoucherPageModule' },
    ]
  },
  {
    path:'',
    redirectTo:'tabs/tab1',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
