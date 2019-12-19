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
    this.getData()

  }

  uploadFile(event: FileList) {
    
 
    // The File object
    const file = event.item(0)
 
    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
     console.error('unsupported file type :( ')
     return;
    }
 
    this.isUploading = true;
    this.isUploaded = false;
 
 
    this.fileName = file.name;
 
    // The storage path
    const path = `daurStorage/${new Date().getTime()}_${file.name}`;
 
    // Totally optional metadata
    const customMetadata = { app: 'Daur App image' };
 
    //File reference
    const fileRef = this.storage.ref(path);
 
    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });
 
    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      
      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();
        
        this.UploadedFileURL.subscribe(resp=>{
         /*  this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          }); */

          let body = {
            image: resp
          }

          this.api.update_image(body,this.curUser);
          this.isUploading = false;
          this.isUploaded = true;
          this.getData()
        },error=>{
          console.error(error);
        })
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    )
    
  }
  

/*   browseImage(){
    this.fileChooser.open()
  .then(
    uri => {
      this.imgPreview = uri;
      console.log(uri)
    }
    )
  .catch(e => console.log(e));
  } */

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
