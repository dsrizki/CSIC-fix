import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/service/api.service';
import { AngularFirestoreCollection } from 'angularfire2/firestore'
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { ActionSheetController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  segment = "history"
  curUser: any;
  user:any;
  fix;
  encodedData
  

  constructor(private router: Router,public fAuth: AngularFireAuth,public actionSheetController: ActionSheetController,private api: ApiService,public barcodeCtrl: BarcodeScanner) { 
    this.curUser = localStorage.getItem("curUser")
    console.log("curUser",this.curUser)
   
  }

  ngOnInit() {
    this.getData()
  }

  getData(){
    this.api.read_userId(this.curUser).subscribe(res =>{
     //this.user = res;
     this.user = res.map(e => {
      return {
        id: e.payload.doc.id,
        name: e.payload.doc.data()['name'],
        email: e.payload.doc.data()['email'],
        points: e.payload.doc.data()['points'],
        univ: e.payload.doc.data()['university'],
      };
    })

    
    console.log("useraa",this.user)
   
   })

  // this.fix = this.user[0].email;
   console.log("fix",this.fix)
  
   
  }

  goToCreateCode() {
    this.barcodeCtrl.encode(this.barcodeCtrl.Encode.TEXT_TYPE, this.curUser).then((encodedData) => {
      console.log(encodedData);
      this.encodedData = encodedData;
    }, (err) => {
      console.log('Error occured : ' + err);
    });
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

  logout() {
    this.fAuth.auth.signOut();
    this.router.navigateByUrl("/auth")
  }

}
