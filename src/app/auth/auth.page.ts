import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  
  segment = "login"
  constructor(private router:Router) { }

  ngOnInit() {
  }

  test(){
    console.log("ASd")
  }


  register(){
    this.router.navigateByUrl("/home/tabs/tab1")
  }

  login(){
    this.router.navigateByUrl("/scan")
  }

}
