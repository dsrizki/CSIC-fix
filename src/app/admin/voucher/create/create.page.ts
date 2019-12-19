import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/shared/service/loading.service';
import { ApiService } from 'src/app/shared/service/api.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  fgCreateReward: FormGroup;

  curUser;
  // Uploaded File URL
  UploadedFileURL: Observable<string>;
  // Snapshot of uploading file
  snapshot: Observable<any>;
  // Progress in percentage
  percentage: Observable<number>;
  // Upload Task 
  task: AngularFireUploadTask;
  //File details  
  fileName:string;
  fileSize:number;
  //Status check 
  isUploading:boolean;
  isUploaded:boolean;

  constructor(
    private storage: AngularFireStorage,
    private database: AngularFireDatabase,
    private api: ApiService,
    private loading: LoadingService,
  ) { }

  ngOnInit() {
    this.initFormCreateReward();
  }

  uploadFile(event: FileList){

    this.loading.present()
    // The File object
    const file = event.item(0);

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
    this.snapshot = this.task.snapshotChanges().pipe(
      
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

          this.fgCreateReward.controls.image.patchValue(resp);
          
          // this.api.createReward(body);
        
          this.loading.dismiss()

        },error=>{
          console.error(error);
        this.loading.dismiss()
        })
      })
    )
  }

  initFormCreateReward(){
    this.fgCreateReward = new FormGroup(
      {
        name: new FormControl("",Validators.required),
        image: new FormControl("", Validators.required),
        description: new FormControl("",Validators.required),
        point_price: new FormControl("",Validators.required),
        qty: new FormControl("",Validators.required)
      }
    )
  }

  async createReward(){

    this.loading.present();
    this.loading.dismiss();
    let reward = this.database.createPushId()
    this.fgCreateReward.addControl('reward_id',new FormControl(reward,Validators.required));
    let body = this.fgCreateReward.value;
    this.api.createReward(body);
  }

}
