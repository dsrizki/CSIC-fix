import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/service/api.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  detailReward = [];

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) {}

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
          // console.log();
        });
        // this.loadedRecipe = this.recipesSvc.getRecipe(paramMap.get('recipeId'));
      });
  }

}
