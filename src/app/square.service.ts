import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SquareService {

  constructor(private firestore: AngularFirestore) { }

  getSquares(): Observable<any>{
    return this.firestore.collection('squares').snapshotChanges()
  }
 
}
