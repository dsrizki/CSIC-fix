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
    this.firestore.doc('User/' + recordID).update(record);
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
}
