import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/shared/service/loading.service';
import { ApiService } from 'src/app/shared/service/api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  fgCreateReward: FormGroup;

  constructor(
    private api: ApiService,
    private loading: LoadingService,
  ) { }

  ngOnInit() {
    this.initFormCreateReward();
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
    this.fgCreateReward.addControl('reward_id',new FormControl("V01",Validators.required));
    let body = this.fgCreateReward.value;
    this.api.createReward(body);
  }

}
