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
        let vehicles = await AsyncStorage.getItem('vehicles');
        vehicles = vehicles ? JSON.parse(vehicles) : [];

        if (!vehicles.some(v => v.plate === vehicle.plate)) {
          // Convierte el objeto a un formato que Firestore pueda entender
          const vehicleData = { ...vehicle };
          await addDoc(collection(this.db, "vehicles"), vehicleData);
          vehicles.push(vehicleData);
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
        let interestPoints = await AsyncStorage.getItem('interestPoints');
        interestPoints = interestPoints ? JSON.parse(interestPoints) : [];

        if (!interestPoints.some(ip => ip.name === interestPoint.name)) {
          // Convierte el objeto a un formato que Firestore pueda entender
          const interestPointData = { ...interestPoint };
          await addDoc(collection(this.db, "interestPoints"), interestPointData);
          interestPoints.push(interestPointData);
          await AsyncStorage.setItem('interestPoints', JSON.stringify(interestPoints));
        }
      } catch (error) {
        throw error;
      }
    }  else {
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
