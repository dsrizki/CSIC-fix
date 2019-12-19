import { Injectable } from '@angular/core';

import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private userRef: DocumentReference
  constructor(private firestore: AngularFirestore) {
    
   }


  create_user(record) {
    return this.firestore.collection('User').add(record);
    
  }
 
  read_user() {
    return this.firestore.collection('User').snapshotChanges();
  }

  read_userId(id:string) {
   return this.firestore.collection('User', ref => ref.where('uid','==',id)).snapshotChanges()
  }
 
  update_user(recordID,record){
    return this.firestore.doc('User/' + recordID).update(record);
  }
 
  delete_user(record_id) {
    this.firestore.doc('User/' + record_id).delete();
  }

  read_rewards(){
    return this.firestore.collection('Rewards').snapshotChanges();
  }
  read_rewardsID(id:string){
    return this.firestore.collection('Rewards', ref => ref.where('reward_id','==',id)).snapshotChanges()
  }

  update_point(body,uid){

    let data = []
    return this.firestore.collection('User', ref => ref.where('uid','==',uid)).snapshotChanges()
    .subscribe(a => {
     
      data = a.map(e => {
        return {
          id: e.payload.doc.id,
          points: e.payload.doc.data()['points']
        }
      })
     /*  console.log("points dikirim",body.points)
      console.log("points",data[0].points)
      let current = parseInt(body.points)
      let update = parseInt(data[0].points)
      let sum = current + update
      console.log("sum points",sum)
      let model = {
        points: sum
      } */

     this.firestore.doc('User/'+data[0].id).update(body);
    })
    
    
    
  }

  update_image(body,uid){

    let data = []
    return this.firestore.collection('User', ref => ref.where('uid','==',uid)).snapshotChanges()
    .subscribe(a => {
     
      data = a.map(e => {
        return {
          id: e.payload.doc.id,
          points: e.payload.doc.data()['points']
        }
      })
     /*  console.log("points dikirim",body.points)
      console.log("points",data[0].points)
      let current = parseInt(body.points)
      let update = parseInt(data[0].points)
      let sum = current + update
      console.log("sum points",sum)
      let model = {
        points: sum
      } */

     this.firestore.doc('User/'+data[0].id).update(body);
    })
    
    
    
  }

  
}
