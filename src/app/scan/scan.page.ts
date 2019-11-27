import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import { ApiService } from '../shared/service/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  scannedData: any;
  encodedData: '';
  encodeData: any;
  curUser
  user = []
  fg: FormGroup
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
  constructor(private api:ApiService,public fAuth: AngularFireAuth,public barcodeCtrl: BarcodeScanner,public actionSheetController: ActionSheetController,public router: Router) {

    this.fg = new FormGroup({
      uid: new FormControl("",Validators.required),
      points: new FormControl(null,Validators.required)
    })

   }

  ngOnInit() {
    this.curUser = localStorage.getItem('curUser')
    this.getData()

  }

  getData(){
    this.api.read_userId(this.curUser).subscribe(res =>{
     //this.user = res;
     this.user = res.map(e => {
      return {
        id: e.payload.doc.id,
        isEdit: false,
        name: e.payload.doc.data()['name'],
        email: e.payload.doc.data()['email'],
        points: e.payload.doc.data()['points'],
        univ: e.payload.doc.data()['university'],
      };
    })

    let user = this.user[0]
    this.user = user;

    console.log("useraa",this.user)
    
   })

  
   
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
      this.fg.controls.uid.patchValue(this.scannedData["text"])

    }).catch(err => {
      console.log('Error', err);
    });

}

logout() {
  this.fAuth.auth.signOut();
  this.router.navigateByUrl("/auth")
}


}
