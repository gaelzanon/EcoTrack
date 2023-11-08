import {initializeApp} from 'firebase/app';
import firebaseConfig from './config';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
class Firebase {
  constructor() {
    const firebaseApp = initializeApp(firebaseConfig);
    this.db = getFirestore(firebaseApp);
    this.auth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
}

const firebase = new Firebase();

export default firebase;