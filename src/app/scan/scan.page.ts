import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  scannedData: any;
  encodedData: '';
  encodeData: any;
  options: BarcodeScannerOptions = {
    preferFrontCamera: false,
    showFlipCameraButton: false,
    showTorchButton: true,
    torchOn: false,
    prompt: 'Arahkan QR CODE pada kotak scan',
    resultDisplayDuration: 500,
    formats: 'QR_CODE,PDF_417 ',
    orientation: 'portrait',
  };
  constructor(public fAuth: AngularFireAuth,public barcodeCtrl: BarcodeScanner,public actionSheetController: ActionSheetController,public router: Router) { }

  ngOnInit() {
   

  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Action',
      buttons: [{
        text: 'Logout',
        role: 'destructive',
        handler: () => {
          
          this.logout()
          console.log('Delete clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  scan(){
  
    this.barcodeCtrl.scan(this.options).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.scannedData = barcodeData;

    }).catch(err => {
      console.log('Error', err);
    });

}

logout() {
  this.fAuth.auth.signOut();
  this.router.navigateByUrl("/auth")
}


}
