import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/service/api.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { ActionSheetController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingService } from '../shared/service/loading.service';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

import { tap, finalize } from 'rxjs/operators';
export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})



export class ProfilePage implements OnInit {
  //image upload
   // Upload Task 
   task: AngularFireUploadTask;
 
   // Progress in percentage
   percentage: Observable<number>;
  
   // Snapshot of uploading file
   snapshot: Observable<any>;
  
   // Uploaded File URL
   UploadedFileURL: Observable<string>;
  
   //Uploaded Image List
   images: Observable<MyData[]>;

    //File details  
    fileName:string;
    fileSize:number;

    //Status check 
    isUploading:boolean;
    isUploaded:boolean;

  segment = "history"
  curUser: any;
  user:any;
  userId: any;
  fg:FormGroup
  imgPreview;
  uidRef;
  history: any;

  constructor(private storage: AngularFireStorage,
    private fileChooser: FileChooser,
    public loading:LoadingService,
    private router: Router,
    public fAuth: AngularFireAuth,
    public actionSheetController: ActionSheetController,
    private api: ApiService,
    public barcodeCtrl: BarcodeScanner) { 
    this.curUser = localStorage.getItem("curUser")
    console.log("curUser",this.curUser)
   
  }

  ngOnInit() {
    this.getUid()
    this.getData()


  }

  ionViewDidEnter(){

    if(this.uidRef){
      this.getHistory()
  
    }

  }

  getHistory(){

  
      this.api.read_history(this.uidRef).subscribe(res => {
       
        this.history = res.map(e => {
          return {
            type: e.payload.doc.data()['type'],
            points: e.payload.doc.data()['points'],
            date: e.payload.doc.data()['date']
          }
        })
        console.log("history",this.history)
        this.history.sort((a, b) => {
          if (a.date > b.date) return -1;
          if (a.date < b.date) return 1;
         })

      })
  
    
    
  }

  getUid(){
    this.api.read_userId(this.curUser).subscribe(res =>{
      this.user = res.map(e => {
        return {
          id: e.payload.doc.id,
        
        }
      });

     
      let b = this.user[0].id;
      this.uidRef = b;
     // this.user = a;
      console.log("refid",b)
      this.getHistory();
      
    })

  }

 


  initForm(){
    this.fg = new FormGroup({
      name: new FormControl(this.user[0].name,Validators.required)
    })
  }

  save(){
    this.loading.present();
    let body = this.fg.value
    this.api.update_user(this.userId,body).then(()=>{
      this.loading.dismiss()
    })
    
    console.log("saved")
  }


  getData(){
    this.api.read_userId(this.curUser).subscribe(res =>{
     //this.user = res;
     this.user = res.map(e => {
      return {
        id: e.payload.doc.id,
        name: e.payload.doc.data()['name'],
        image: e.payload.doc.data()['image'],
        email: e.payload.doc.data()['email'],
        points: e.payload.doc.data()['points'],
        univ: e.payload.doc.data()['university'],
      };
    })

    this.initForm();
    console.log("useraa",this.user)
    let a = this.user[0];
    this.user = a;
    this.userId = this.user.id
   
   })

  // this.fix = this.user[0].email;
 //  console.log("fix",this.fix)
  
   
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
