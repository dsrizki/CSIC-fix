import { Component } from '@angular/core';
import { ApiService } from '../shared/service/api.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
 
})
export class HomePage {
  visibility: string = 'shown';
  curUser
  user= []
  allUser:any;
  curDate = new Date()
  constructor(private api:ApiService) {

   this.user = null;
  
    this.curUser = localStorage.getItem('curUser')
    this.getData()
    this.getAllUser();

  }

  getAllUser(){
    this.api.read_user().subscribe(res => {
      this.allUser = res.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          name: e.payload.doc.data()['name'],
          email: e.payload.doc.data()['email'],
          points: e.payload.doc.data()['points'],
          univ: e.payload.doc.data()['university'],
        };
      })  
      console.log("alluser",this.allUser)
      this.allUser.sort((a, b) => {
       if (a.points > b.points) return -1;
       if (a.points < b.points) return 1;
      })
      console.log("leaderboard",this.allUser)
    })


    
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

    let user = this.user[0]
    this.user = user;

    console.log("useraa",this.user)
    
   })

  }

}
