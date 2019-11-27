import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/service/api.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.page.html',
  styleUrls: ['./voucher.page.scss'],
})
export class VoucherPage implements OnInit {

  reward:any;

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.getData()
  }

  getData(){
    this.api.read_rewards().subscribe(res =>{
      this.reward = res.map(e => {
        return{
          id: e.payload.doc.id,
          description: e.payload.doc.data()['description'],
          image: e.payload.doc.data()['image'],
          name: e.payload.doc.data()['name'],
          point_price: e.payload.doc.data()['point_price'],
          qty: e.payload.doc.data()['qty'],
          reward_id: e.payload.doc.data()['reward_id'],
        };
      });
      console.log("cihuyyy", this.reward);
    });
  }

  redeem(id:string){
    this.router.navigate(["voucher",id]);
  }
}
