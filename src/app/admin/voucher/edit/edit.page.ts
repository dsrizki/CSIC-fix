import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { LoadingService } from 'src/app/shared/service/loading.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  detailReward = [];
  fg: FormGroup
  rewardref;

  constructor(private api:ApiService,public loading: LoadingService,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if (!paramMap.has('id')){return;}
        let id = paramMap.get('id');
        console.log(id);
        this.api.read_rewardsID(id).subscribe(res =>{
          this.detailReward = res.map(e => {
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
          
          let a = this.detailReward[0];
          this.detailReward = a;

          if(a){
            this.initForm(a)
          }

          this.rewardref = a.id
       /*    this.qty = a.qty
          this.rewardref = a.id
          this.price = a.point_price
          console.log("this point price",this.price) */
          // console.log();
        });
        // this.loadedRecipe = this.recipesSvc.getRecipe(paramMap.get('recipeId'));
      });
  
  }

  initForm(data){
    this.fg = new FormGroup({
      name: new FormControl(data.name,Validators.required),
      point_price: new FormControl(data.point_price,Validators.required),
      qty: new FormControl(data.qty,Validators.required),
      description: new FormControl(data.description,Validators.required),
      
    })
  }

  update(){
    let body = this.fg.value;
    this.loading.present()

    this.api.updateReward(this.rewardref,body).then(()=>{
      this.loading.dismiss();
      this.loading.presentToast('reward updated')
    })
  }

}
