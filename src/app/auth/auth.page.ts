import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../shared/service/api.service';
import { LoadingService } from '../shared/service/loading.service';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  fgRegister: FormGroup
  fgLogin: FormGroup
  segment = "login"
  adminId = "yKSIDwf726YPCquNFYCacvq6GHA2"
  constructor(private router:Router,
    private api: ApiService,
    private loading: LoadingService, 
    private fireAuth: AngularFireAuth,
    public toastController: ToastController
    ) { }

  ngOnInit() {
    this.initFormRegister()
    this.initFormLogin();
  }

  test(){
    console.log("ASd")
  }

  initFormRegister(){
    this.fgRegister = new FormGroup(
      {
        name: new FormControl("",Validators.required),
        university: new FormControl("", Validators.required),
        email: new FormControl("",Validators.required),
        password: new FormControl("",Validators.required)
      }
    )
  }

  initFormLogin(){
    this.fgLogin = new FormGroup(
      {
        email: new FormControl("",Validators.required),
        password: new FormControl("",Validators.required)
      }
    )
  }



  async register(){
    //this.router.navigateByUrl("/home/tabs/tab1")
   
    console.log("email",this.fgRegister.value.email)
    
    this.loading.present()
    try {
      var r = await this.fireAuth.auth.createUserWithEmailAndPassword(
        this.fgRegister.value.email,
        this.fgRegister.value.password
      );
      if(r){
        this.loading.dismiss()
        this.presentToast('Sukses Register')
        this.segment = 'login';
        let uid = r.user.uid
        this.fgRegister.addControl('uid', new FormControl(uid,Validators.required))
        this.fgRegister.addControl('points', new FormControl(0,Validators.required))
        let body = this.fgRegister.value
        console.log("body after append",body)
        this.api.create_user(body)
       
      }
    }catch (err){
      this.loading.dismiss()
      console.log(err)
      this.loading.presentToast(err);
    }


    



  }

  async login() {
    let body = this.fgLogin.value;
    console.log("email",this.fgLogin.value.email)
    console.log("passw",this.fgLogin.value.password)
    this.loading.present()
    try {
      var r = await this.fireAuth.auth.signInWithEmailAndPassword(
        this.fgLogin.value.email,
        this.fgLogin.value.password
      );
      if (r) {
        this.loading.dismiss()
        console.log("Successfully logged in!",r);
        let current = this.fireAuth.auth.currentUser.uid
        console.log("current",current)
        if(current === this.adminId){
        
          localStorage.setItem("curUser",current)
        this.router.navigateByUrl("/scan")
        }else{
        localStorage.setItem("curUser",current)
        this.router.navigateByUrl("/home")
        }
      }

    } catch (err) {
      this.loading.dismiss()
      console.error(err);
      this.presentToast(err.message)
    }
  }


 


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


  
}
