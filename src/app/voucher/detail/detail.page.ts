import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/service/api.service';
import { LoadingService } from 'src/app/shared/service/loading.service';
import { AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/service/toast.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  detailReward = [];
  uid;
  user: any;
  uidRef;
  price;
  qty;
  rewardref;
  curDate = new Date();
  constructor(public router: Router,public toast:ToastService,public alertController: AlertController,public loading:LoadingService,private api: ApiService, private activatedRoute: ActivatedRoute) {
    this.uid = localStorage.getItem("curUser")
  }

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
          this.qty = a.qty
          this.rewardref = a.id
          this.price = a.point_price
          console.log("this point price",this.price)
          // console.log();
        });
        // this.loadedRecipe = this.recipesSvc.getRecipe(paramMap.get('recipeId'));
      });
  }

  redeem(){
    this.api.read_userId(this.uid).subscribe(res =>{
      this.user = res.map(e => {
        return {
          id: e.payload.doc.id,
          points: e.payload.doc.data()['points'],
        }
      });

      let a = this.user[0].points;
      let b = this.user[0].id;
      this.uidRef = b;
      this.user = a;
      console.log("refid",b)
      console.log("user a points",a)
    })

    this.presentAlertConfirm()
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Send Point Confirm',
      message: '<strong>Are you sure to send point?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.update()
          }
        }
      ]
    });
  
    await alert.present();
  }


  update(){
    this.loading.present()
    
    

    let current = parseInt(this.user)
    let price = parseInt(this.price)

    let qty = parseInt(this.qty)

    console.log("current qty",qty)

    

    if(current < price){
      this.loading.dismiss()
      this.loading.presentToast('Your points is not enough to redeem this voucher');
      return false;
    }

    let transact = current - price;
    let minus = qty - 1;

    let body = {
      points: transact,
    }

    this.api.update_point(body,this.uid)


    let model = {
      qty: minus
    }

    this.api.updateReward(this.rewardref,model).then(()=>{
      console.log("update reward qty")
      this.loading.presentToast("Reward purchased")
      this.router.navigate(['/home/tabs/tab3'])
    })

    let history = {
      type: "purchase",
      date: this.curDate,
      points: price
    }
    this.api.create_history(this.uidRef,history);
    this.loading.dismiss()
    
  }

}
