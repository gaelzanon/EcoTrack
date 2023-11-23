import firebaseInstance from '../firebase';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addDoc, collection, doc} from 'firebase/firestore';

class CloudService {
  constructor(env) {
    this.db = firebaseInstance.db;
    this.env = env; // 'test' o 'production'
  }
  get vehiclesCollection() {
    return collection(doc(this.db, this.env), 'vehicles');
  }

  get interestPointsCollection() {
    return collection(doc(this.db, this.env), 'interestPoints');
  }

  async addVehicle(vehicle) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;
    if (isConnected) {
      try {
        let vehicles = await AsyncStorage.getItem('vehicles');
        vehicles = vehicles ? JSON.parse(vehicles) : [];

        if (!vehicles.some(v => v.plate === vehicle.plate)) {
          // Convierte el objeto a un formato que Firestore pueda entender
          const vehicleData = {...vehicle};
          await addDoc(this.vehiclesCollection, vehicleData);
          vehicles.push(vehicleData);
          await AsyncStorage.setItem('vehicles', JSON.stringify(vehicles));
        } else {
          const error = new Error('DuplicateVehicleException');
          error.code = 'DuplicateVehicleException';
          throw error;
        }
      } catch (error) {
        throw error;
      }
    } else {
      //No hay internet
      //Add el vehiculo solo a la base de datos local si vehicle.plate no está ya
      let vehicles = await AsyncStorage.getItem('vehicles');
      vehicles = vehicles ? JSON.parse(vehicles) : [];

      if (!vehicles.some(v => v.plate === vehicle.plate)) {
        vehicles.push(vehicle);
        await AsyncStorage.setItem('vehicles', JSON.stringify(vehicles));
      } else {
        const error = new Error('DuplicateVehicleException');
        error.code = 'DuplicateVehicleException';
        throw error;
      }
    }
  }

  async addInterestPoint(interestPoint) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;
    if (isConnected) {
      try {
        let interestPoints = await AsyncStorage.getItem('interestPoints');
        interestPoints = interestPoints ? JSON.parse(interestPoints) : [];

        if (!interestPoints.some(ip => ip.name === interestPoint.name)) {
          // Convierte el objeto a un formato que Firestore pueda entender
          const interestPointData = {...interestPoint};
          await addDoc(this.interestPointsCollection, interestPointData);
          interestPoints.push(interestPointData);
          await AsyncStorage.setItem(
            'interestPoints',
            JSON.stringify(interestPoints),
          );
        } else {
          const error = new Error('DuplicateInterestPointException');
          error.code = 'DuplicateInterestPointException';
          throw error;
        }
      } catch (error) {
        throw error;
      }
    } else {
      //No hay internet
      //Add el punto de interes solo a base de datos local si el interestPoint.name no está ya
      let interestPoints = await AsyncStorage.getItem('interestPoints');
      interestPoints = interestPoints ? JSON.parse(interestPoints) : [];

      if (!interestPoints.some(ip => ip.name === interestPoint.name)) {
        interestPoints.push(interestPoint);
        await AsyncStorage.setItem(
          'interestPoints',
          JSON.stringify(interestPoints),
        );
      } else {
        const error = new Error('DuplicateInterestPointException');
        error.code = 'DuplicateInterestPointException';
        throw error;
      }
    }
  }

  async clearCollection(collectionName) {
    if (this.env === 'test') {
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    }
  }
}
const cloudService = new CloudService();
export default cloudService;
