import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLanding = redirectUnauthorizedTo(['auth']);

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'home', loadChildren: './tabs/tabs.module#TabsPageModule',...canActivate(redirectUnauthorizedToLanding)},
  { path: 'voucher', loadChildren: './voucher/voucher.module#VoucherPageModule',...canActivate(redirectUnauthorizedToLanding) },
  { path: 'voucher/:id', loadChildren: './voucher/detail/detail.module#DetailPageModule',...canActivate(redirectUnauthorizedToLanding) },
  // { path: 'detail', loadChildren: './voucher/detail/detail.module#DetailPageModule',...canActivate(redirectUnauthorizedToLanding) },
  { path: 'history', loadChildren: './history/history.module#HistoryPageModule',...canActivate(redirectUnauthorizedToLanding) },
  { path: 'qrcode', loadChildren: './qrcode/qrcode.module#QrcodePageModule',...canActivate(redirectUnauthorizedToLanding) },
  { path: 'scan', loadChildren: './scan/scan.module#ScanPageModule',...canActivate(redirectUnauthorizedToLanding) },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },  { path: 'edit-profile', loadChildren: './edit-profile/edit-profile.module#EditProfilePageModule' },

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
