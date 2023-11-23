import {initializeApp} from 'firebase/app';
import firebaseConfig from './config';
import { getFirestore } from 'firebase/firestore';
import {initializeAuth} from 'firebase/auth';
class Firebase {
  constructor() {
    if (!Firebase.instance) {
      const firebaseApp = initializeApp(firebaseConfig);
      this.db = getFirestore(firebaseApp);
      this.auth = initializeAuth(firebaseApp);
      Firebase.instance = this;
    }
    return Firebase.instance;
  }
}

const firebaseInstance = new Firebase();

export default firebaseInstance;
