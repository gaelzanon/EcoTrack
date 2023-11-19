import firebaseInstance from '../firebase';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
class AuthService {
  constructor() {
    this.auth = firebaseInstance.auth;
    this.db = firebaseInstance.db;
  }

  async createUserWithEmailAndPassword(email, password) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;
    if (isConnected) {
      try {
        return 1;
      } catch (error) {
        // Manejo de errores específicos de Firebase o lógica adicional
        throw error;
      }
    } else {
      Alert.alert('You need internet connection to log in.');
    }
  }

  async signInWithEmailAndPassword(email, password) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;
    if (isConnected) {
      
      try {
        const userCredential = await signInWithEmailAndPassword(
          this.auth,
          email,
          password,
        );

        const userLocal = userCredential.user;
        if (!userLocal.emailVerified) {
          await signOut(this.auth);
          Alert.alert('Please verify your email.');
          return;
        }
        
        // Otras operaciones necesarias después del inicio de sesión
        // await AsyncStorage.setItem('user', JSON.stringify(userLocal));
      } catch (error) {
        // Manejo de errores específicos de Firebase o lógica adicional
        throw error;
      }
    } else {
      Alert.alert('You need internet connection to register.');
    }
  }
}
const authService = new AuthService();
export default authService;
