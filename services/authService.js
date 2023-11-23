import firebaseInstance from '../firebase';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {addDoc, collection, doc} from 'firebase/firestore';
class AuthService {
  constructor(env) {
    this.auth = firebaseInstance.auth;
    this.db = firebaseInstance.db;
    this.env = env; // 'test' o 'production'
  }
  get usersCollection() {
    return collection(doc(this.db, this.env), 'users');
  }
  async createUserWithEmailAndPassword(email, password) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;
    if (isConnected) {
      try {
        const res = await createUserWithEmailAndPassword(
          this.auth,
          email,
          password,
        );

        const user = res.user;

        await addDoc(this.usersCollection, {
          uid: user.uid,
          email,
        });

        await sendEmailVerification(user);
        await signOut(this.auth);
        Alert.alert('Registered successfully, please verify your email.');
      } catch (error) {
        // Manejo de errores específicos de Firebase
        throw error;
      }
    } else {
      const error = new Error('NoInetConection');
      error.code = 'NoInetConection';
      throw error;
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

        //Si no está verificado el correo, se lo indicamos y no le dejamos loggearse
        const userLocal = userCredential.user;
        if (!userLocal.emailVerified) {
          await signOut(this.auth);
          Alert.alert('Please verify your email.');
          return;
        }

        // Otras operaciones necesarias después del inicio de sesión
        //Si esta verificado le logeamos y guardamos el perfil en la base de datos local
        await AsyncStorage.setItem('user', JSON.stringify(userLocal));
        return userLocal;
      } catch (error) {
        // Manejo de errores específicos de Firebase
        throw error;
      }
    } else {
      const error = new Error('NoInetConection');
      error.code = 'NoInetConection';
      throw error;
    }
  }
}

export default AuthService;
