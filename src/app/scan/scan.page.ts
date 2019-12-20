import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import { ApiService } from '../shared/service/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingService } from '../shared/service/loading.service';
import { Subscription } from 'rxjs';

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
  curDate = new Date();
  user = []
  fg: FormGroup
  targetUser = []
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
  currentPoint;
  targetPoint;
  subs: Subscription;
  uidRef;
  constructor(public menu: MenuController,public alertController: AlertController,private loading: LoadingService,private api:ApiService,public fAuth: AngularFireAuth,public barcodeCtrl: BarcodeScanner,public actionSheetController: ActionSheetController,public router: Router) {
    this.menu.enable(false);
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

 save(){

  //this.loading.present()
 this.targetPoint = this.fg.value.points
  let uid = this.fg.value.uid

 /*  let body = {
    points: point
  } */
  
   this.subs =  this.api.read_userId(uid).subscribe(res =>{
      //this.user = res;
      this.targetUser = res.map(e => {
       return {
         id: e.payload.doc.id,
         points: e.payload.doc.data()['points'],
       };
     })
     
     this.uidRef = this.targetUser[0].id
  console.log("targetuser",this.targetUser)
  
    })


 // this.updatePoint()
this.presentAlertConfirm() 
 //this.loading.dismiss()
  
  
}

async presentAlertConfirm() {
  const alert = await this.alertController.create({
    header: 'Send Point Confirm',
    message: '<strong>Are you sure to send point?</strong>',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');
          this.updatePoint()
        }
      }
    ]
  });

  await alert.present();
}

updatePoint(){
  this.subs.unsubscribe();
  this.loading.present()
  let uid = this.fg.value.uid

  let current = parseInt(this.targetUser[0].points)
  let update = parseInt(this.targetPoint)
  console.log("current",current)
  console.log("update",update)
  let sum = current + update
  console.log("sum",sum)

  let body = {
    points: sum
  }

  let history = {
    type: "deposit",
    date: this.curDate,
    points: update
  }
  
  this.api.create_history(this.uidRef,history);
  this.api.update_point(body,uid)
  
  this.loading.presentToast('Sukses menambahkan point')
  this.loading.dismiss()
}

logout() {
  this.fAuth.auth.signOut();
  this.router.navigateByUrl("/auth")
}


}
