import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)},
  { path: 'voucher', loadChildren: './voucher/voucher.module#VoucherPageModule' },
  { path: 'detail', loadChildren: './voucher/detail/detail.module#DetailPageModule' },
  { path: 'history', loadChildren: './history/history.module#HistoryPageModule' },
  { path: 'qrcode', loadChildren: './qrcode/qrcode.module#QrcodePageModule' },
  { path: 'scan', loadChildren: './scan/scan.module#ScanPageModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  /* { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' }, */

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
