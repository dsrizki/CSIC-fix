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
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  userId;
  curUser;
  fg: FormGroup;
  user:any;
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
  // images: Observable<MyData[]>;

    //File details  
    fileName:string;
    fileSize:number;

    //Status check 
    isUploading:boolean;
    isUploaded:boolean;


  constructor(private storage: AngularFireStorage,
  //  private fileChooser: FileChooser,
    public loading:LoadingService,
    private router: Router,
    public fAuth: AngularFireAuth,
    public actionSheetController: ActionSheetController,
    private api: ApiService,
 ) { 
    this.curUser = localStorage.getItem("curUser")
    console.log("curUser",this.curUser)
  }

  ngOnInit() {
    this.getData()
  }

  uploadFile(event: FileList) {
    
    this.loading.present()
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
 
    console.log("upload image")
    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
     this.task.snapshotChanges().pipe(
      
      finalize(() => {
        // Get uploaded file storage path
        console.log("asdsda")
        this.UploadedFileURL = fileRef.getDownloadURL();
        console.log("asdsda",this.UploadedFileURL)
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
        
          this.loading.dismiss()
          this.getData()
        },error=>{
          console.error(error);
        this.loading.dismiss()
        })
      })
    ).subscribe();
    
  }

  save(){
    this.loading.present();
    let body = this.fg.value
    this.api.update_user(this.userId,body).then(()=>{
      this.loading.dismiss()
      this.router.navigate(['home/tabs/tab2'])
    })
    
    console.log("saved")
  }

  initForm(){
    this.fg = new FormGroup({
      name: new FormControl(this.user[0].name,Validators.required)
    })
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

}
