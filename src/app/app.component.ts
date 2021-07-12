import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import 'firebase/auth';
import 'firebase/firestore';
import './firebase-requests'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kanban-fire';
  counter = this.store.collection('count').valueChanges({ idField: 'id' }) as Observable<any>;

  constructor( private store: AngularFirestore) {
    this.asyncSignIn(store)
  }

  async nestedThenSignIn(store: AngularFirestore) {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const docRef = store.collection("counter").doc(`userId_${result.user?.uid}`);
        docRef.get().toPromise().then((doc) => {
              if (doc.exists) {
                  console.log("Document data:", doc.data());
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
              }
          }).catch((error) => {
              console.log("Error getting document:", error);
          });
      })
  }

  async asyncSignIn(store: AngularFirestore) {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await firebase
      .auth()
      .signInWithPopup(provider);

    const docRef = store.collection("counter").doc(result.user?.uid);


    const doc = await docRef.get().toPromise()

    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        docRef.set({});
    }
  }


  async chainedThenSignIn(store: AngularFirestore) {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const docRef = store.collection("counter").doc(result.user?.uid);
        return docRef.get().toPromise();
      })
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
  }
}
