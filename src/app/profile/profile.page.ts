import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/service/api.service';
import { AngularFirestoreCollection } from 'angularfire2/firestore'
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  segment = "history"
  curUser: any;
  user:any;
  fix;

  constructor(private api: ApiService) { 
    this.curUser = localStorage.getItem("curUser")
    console.log("curUser",this.curUser)
   
  }

  ngOnInit() {
    this.getData()
  }


  getData(){
    this.api.read_userId(this.curUser).subscribe(res =>{
     //this.user = res;
     this.user = res.map(e => {
      return {
        id: e.payload.doc.id,
        isEdit: false,
        name: e.payload.doc.data()['name'],
        email: e.payload.doc.data()['email'],
        points: e.payload.doc.data()['points'],
        univ: e.payload.doc.data()['university'],
      };
    })

    
    console.log("useraa",this.user)
   })

  // this.fix = this.user[0].email;
   console.log("fix",this.fix)
  
   
  }

}
