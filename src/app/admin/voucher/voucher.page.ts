import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/service/api.service';
import { ActionSheetController } from '@ionic/angular';
import { LoadingService } from 'src/app/shared/service/loading.service';


@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.page.html',
  styleUrls: ['./voucher.page.scss'],
})
export class VoucherPage implements OnInit {
reward: any

  constructor(public loading: LoadingService,public actionSheetController: ActionSheetController,private api: ApiService, private router: Router) { }

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

  edit(id){
    this.router.navigate(['admin/voucher/edit',id])
  }


  delete(id){

    this.api.delete_reward(id).then(()=>{
      this.loading.presentToast('Deleted');
    })
  }

  async more(id) {
    const actionSheet = await this.actionSheetController.create({
      header: 'More',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.delete(id)
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
  
    await actionSheet.present();
  }

}
