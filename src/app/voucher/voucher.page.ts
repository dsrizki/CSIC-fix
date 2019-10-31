import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.page.html',
  styleUrls: ['./voucher.page.scss'],
})
export class VoucherPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  redeem(){
    this.router.navigateByUrl("/detail")
  }
}
