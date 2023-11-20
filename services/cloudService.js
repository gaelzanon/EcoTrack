import firebaseInstance from '../firebase';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addDoc, collection} from 'firebase/firestore';

class CloudService {
  constructor() {
    this.db = firebaseInstance.db;
  }

  async addVehicle(vehicle) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;
    if (isConnected) {
      try {
        //Hay internet
        //Add vehiculo a firestore y a la base de datos local si vehicle.plate no está ya en base de datos local (esta es la que ira por delante)
        let vehicles = await AsyncStorage.getItem('vehicles');
        vehicles = vehicles ? JSON.parse(vehicles) : [];

        if (!vehicles.some(v => v.plate === vehicle.plate)) {
          await addDoc(collection(this.db, "vehicles"), vehicle);
          vehicles.push(vehicle);
          await AsyncStorage.setItem('vehicles', JSON.stringify(vehicles));
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
      }
    }
  }

  async addInterestPoint(interestPoint) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;
    if (isConnected) {
      try {
        //Hay Internet 
        //Add el punto de interes a firestore y base de datos local si el interestPoint.name no está ya en base de datos local (esta es la que ira por delante)
        let interestPoints = await AsyncStorage.getItem('interestPoints');
        interestPoints = interestPoints ? JSON.parse(interestPoints) : [];

        if (!interestPoints.some(ip => ip.name === interestPoint.name)) {
          await addDoc(collection(this.db, "interestPoints"), interestPoint);
          interestPoints.push(interestPoint);
          await AsyncStorage.setItem('interestPoints', JSON.stringify(interestPoints));
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
        await AsyncStorage.setItem('interestPoints', JSON.stringify(interestPoints));
      }
    }
  }
}
const cloudService = new CloudService();
export default cloudService;
