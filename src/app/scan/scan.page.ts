import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {

  constructor(public actionSheetController: ActionSheetController,public router: Router) { }

  ngOnInit() {
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Action',
      buttons: [{
        text: 'Logout',
        role: 'destructive',
        handler: () => {
          this.router.navigateByUrl("/auth")
          console.log('Delete clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
