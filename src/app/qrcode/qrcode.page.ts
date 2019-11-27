import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {

  qrData = null
  userId: string;
  userQrCode = null
  constructor() { 

    this.userId = localStorage.getItem("curUser")
    console.log("userid -> ",this.userId)

  }

  ngOnInit() {

  }

  

}
