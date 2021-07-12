import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/auth';
import 'firebase/firestore';

export class FirebaseRequests {

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
  };
}
