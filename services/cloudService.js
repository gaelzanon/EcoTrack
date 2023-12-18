import firebaseInstance from '../firebase';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addDoc, collection, getDocs, deleteDoc, updateDoc} from 'firebase/firestore';

class CloudService {
  constructor(env) {
    this.db = firebaseInstance.db;
    this.env = env; // 'test' o 'production'
  }
  get vehiclesCollection() {
    return collection(this.db, `${this.env}_vehicles`);
  }

  get interestPointsCollection() {
    return collection(this.db, `${this.env}_interestPoints`);
  }

  get usersCollection() {
    return collection(this.db, `${this.env}_users`);
  }

  async existsInFirebase(collection, queryFn) {
    const querySnapshot = await getDocs(collection);
    return querySnapshot.docs.some(queryFn);
  }

  async userExists(email) {
    return this.existsInFirebase(
      this.usersCollection,
      doc => doc.data().email === email,
    );
  }
  async vehicleExists(creator, plate) {
    return this.existsInFirebase(
      this.vehiclesCollection,
      doc => doc.data().creator === creator && doc.data().plate === plate,
    );
  }

  async interestPointExists(creator, name) {
    return this.existsInFirebase(
      this.interestPointsCollection,
      doc => doc.data().creator === creator && doc.data().name === name,
    );
  }
  async deleteLocalInfo() {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('vehicles');
    await AsyncStorage.removeItem('interestPoints');
    return true
  }
  async deleteUserInfo(email) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;
    if (isConnected) {
      //Eliminar todos los vehículos del usuario
      const vehicleQuerySnapshot = await getDocs(this.vehiclesCollection);
      const vehicleDeletePromises = vehicleQuerySnapshot.docs
        .filter(doc => doc.data().creator === email)
        .map(doc => deleteDoc(doc.ref));
      await Promise.all(vehicleDeletePromises);

      //Eliminar todos los puntos de interés del usuario
      const interestPointQuerySnapshot = await getDocs(
        this.interestPointsCollection,
      );
      const interestPointDeletePromises = interestPointQuerySnapshot.docs
        .filter(doc => doc.data().creator === email)
        .map(doc => deleteDoc(doc.ref));
      await Promise.all(interestPointDeletePromises);

      //Eliminar el usuario
      const userQuerySnapshot = await getDocs(this.usersCollection);
      const userDoc = userQuerySnapshot.docs.find(
        doc => doc.data().email === email,
      );
      if (userDoc) {
        await deleteDoc(userDoc.ref);
      }
      //Eliminar almacenamiento local
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('vehicles');
      await AsyncStorage.removeItem('interestPoints');
      return true;
    } else {
      const error = new Error('NoInetConection');
      error.code = 'NoInetConection';
      throw error;
    }
  }

  async addVehicle(vehicle) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;
    if (isConnected) {
      try {
        let vehicles = await AsyncStorage.getItem('vehicles');
        vehicles = vehicles ? JSON.parse(vehicles) : [];
        const existsInFirebase = await this.vehicleExists(
          vehicle.creator,
          vehicle.plate,
        );
        if (
          !vehicles.some(v => v.plate === vehicle.plate) &&
          !existsInFirebase
        ) {
          // Convierte el objeto a un formato que Firestore pueda entender
          const vehicleData = {...vehicle};
          await addDoc(this.vehiclesCollection, vehicleData);
          vehicles.push(vehicleData);
          await AsyncStorage.setItem('vehicles', JSON.stringify(vehicles));
          return vehicle;
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
        return vehicle;
      } else {
        const error = new Error('DuplicateVehicleException');
        error.code = 'DuplicateVehicleException';
        throw error;
      }
    }
  }

  async deleteVehicle(vehicle) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;

    if (isConnected) {
      try {
        const existe = await this.vehicleExists(vehicle.creator, vehicle.plate);
        if (!existe) {
          const error = new Error('VehicleNotFoundException');
          error.code = 'VehicleNotFoundException';
          throw error;
        }
        const vehicleQuerySnapshot = await getDocs(this.vehiclesCollection);
        const vehicleDoc = vehicleQuerySnapshot.docs.find(
          doc =>
            doc.data().creator === vehicle.creator &&
            doc.data().plate === vehicle.plate,
        );
        if (vehicleDoc) {
          // Eliminar de BBDD
          await deleteDoc(vehicleDoc.ref);
        }
        // Eliminar objeto de listado en almacenamiento local
        let vehicles = await AsyncStorage.getItem('vehicles');
        vehicles = vehicles ? JSON.parse(vehicles) : [];
        const updatedVehicles = vehicles.filter(
          item => item.plate !== vehicle.plate,
        );
        await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
        return true;
      } catch (error) {
        throw error;
      }
    } else {
      //No hay internet
      // Eliminar objeto de listado en almacenamiento local
      let vehicles = await AsyncStorage.getItem('vehicles');
      vehicles = vehicles ? JSON.parse(vehicles) : [];
      const updatedVehicles = vehicles.filter(
        item => item.plate !== vehicle.plate,
      );
      if (vehicles.length === updatedVehicles.length) {
        const error = new Error('VehicleNotFoundException');
        error.code = 'VehicleNotFoundException';
        throw error;
      }
      await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
      return true;
    }
  }

  async clearCollection(collectionName) {
    if (this.env === 'test') {
      const querySnapshot = await getDocs(
        collection(this.db, `test_${collectionName}`),
      );
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    }
  }

  async addInterestPoint(interestPoint) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;

    if (isConnected) {
      try {
        let interestPoints = await AsyncStorage.getItem('interestPoints');
        interestPoints = interestPoints ? JSON.parse(interestPoints) : [];
        const existsInFirebase = await this.interestPointExists(
          interestPoint.creator,
          interestPoint.name,
        );
        if (
          !interestPoints.some(ip => ip.name === interestPoint.name) &&
          !existsInFirebase
        ) {
          // Convierte el objeto a un formato que Firestore pueda entender
          const interestPointData = {...interestPoint};
          await addDoc(this.interestPointsCollection, interestPointData);
          interestPoints.push(interestPointData);
          await AsyncStorage.setItem(
            'interestPoints',
            JSON.stringify(interestPoints),
          );
          return interestPoint;
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
        return interestPoint;
      } else {
        const error = new Error('DuplicateInterestPointException');
        error.code = 'DuplicateInterestPointException';
        throw error;
      }
    }
  }

  async deleteInterestPoint(interestPoint) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;

    if (isConnected) {
      try {
        const existe = await this.interestPointExists(
          interestPoint.creator,
          interestPoint.name,
        );
        if (!existe) {
          const error = new Error('InterestPointNotFoundException');
          error.code = 'InterestPointNotFoundException';
          throw error;
        }
        const interestPointQuerySnapshot = await getDocs(
          this.interestPointsCollection,
        );
        const interestPointDoc = interestPointQuerySnapshot.docs.find(
          doc =>
            doc.data().creator === interestPoint.creator &&
            doc.data().name === interestPoint.name,
        );
        if (interestPointDoc) {
          // Eliminar de BBDD
          await deleteDoc(interestPointDoc.ref);
        }
        // Eliminar objeto de listado en almacenamiento local
        let interestPoints = await AsyncStorage.getItem('interestPoints');
        interestPoints = interestPoints ? JSON.parse(interestPoints) : [];
        const updatedInterestPoints = interestPoints.filter(
          ip => ip.name !== interestPoint.name,
        );

        await AsyncStorage.setItem(
          'interestPoints',
          JSON.stringify(updatedInterestPoints),
        );
        return true;
      } catch (error) {
        throw error;
      }
    } else {
      //No hay internet
      // Eliminar objeto de listado en almacenamiento local
      let interestPoints = await AsyncStorage.getItem('interestPoints');
      interestPoints = interestPoints ? JSON.parse(interestPoints) : [];
      const updatedInterestPoints = interestPoints.filter(
        ip => ip.name !== interestPoint.name,
      );
      if (interestPoints.length === updatedInterestPoints.length) {
        const error = new Error('InterestPointNotFoundException');
        error.code = 'InterestPointNotFoundException';
        throw error;
      }
      await AsyncStorage.setItem(
        'interestPoints',
        JSON.stringify(updatedInterestPoints),
      );
      return true;
    }
  }

  async clearCollection(collectionName) {
    if (this.env === 'test') {
      const querySnapshot = await getDocs(
        collection(this.db, `test_${collectionName}`),
      );
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    }
  }

  async getVehicles() {
    let vehicles = await AsyncStorage.getItem('vehicles');
    vehicles = vehicles ? JSON.parse(vehicles) : [];
    // Ordenar los puntos de interés para que los favoritos aparezcan primero
    vehicles.sort((a, b) => {
      // Considera los puntos de vehiculos sin el parámetro 'isFavorite' como no favoritos
      const isFavoriteA = a.isFavorite === true;
      const isFavoriteB = b.isFavorite === true;
  
      if (isFavoriteA && !isFavoriteB) {
        return -1; // 'a' es favorito y 'b' no, 'a' va primero
      } else if (!isFavoriteA && isFavoriteB) {
        return 1;  // 'b' es favorito y 'a' no, 'b' va primero
      } else {
        return 0;  // Si ambos son favoritos o no favoritos, se mantienen en el mismo orden
      }
    });
    return vehicles;
  }

  async getInterestPoints() {
    let interestPoints = await AsyncStorage.getItem('interestPoints');
    interestPoints = interestPoints ? JSON.parse(interestPoints) : [];
  
    // Ordenar los puntos de interés para que los favoritos aparezcan primero
    interestPoints.sort((a, b) => {
      // Considera los puntos de interés sin el parámetro 'isFavorite' como no favoritos
      const isFavoriteA = a.isFavorite === true;
      const isFavoriteB = b.isFavorite === true;
  
      if (isFavoriteA && !isFavoriteB) {
        return -1; // 'a' es favorito y 'b' no, 'a' va primero
      } else if (!isFavoriteA && isFavoriteB) {
        return 1;  // 'b' es favorito y 'a' no, 'b' va primero
      } else {
        return 0;  // Si ambos son favoritos o no favoritos, se mantienen en el mismo orden
      }
    });
  
    return interestPoints;
  }
  

  async favoriteInterestPoint(interestPoint) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;

    try {
      let interestPoints = await AsyncStorage.getItem('interestPoints');
      interestPoints = interestPoints ? JSON.parse(interestPoints) : [];

      // Buscar el punto de interés en el almacenamiento local
      const index = interestPoints.findIndex(
        ip =>
          ip.name === interestPoint.name &&
          ip.creator === interestPoint.creator,
      );

      if (index !== -1) {
        // Invertir el estado de favorito, o establecerlo si no existe
        interestPoints[index].isFavorite = !interestPoints[index].isFavorite;
      } else {
        // Si no existe en local , no se puede marcar como favorito

        throw new Error('InterestPointNotFoundException');
      }

      // Actualizar el almacenamiento local
      await AsyncStorage.setItem(
        'interestPoints',
        JSON.stringify(interestPoints),
      );

      if (isConnected) {
        // Actualizar el estado de favorito en la base de datos remota
        const interestPointQuerySnapshot = await getDocs(
          this.interestPointsCollection,
        );
        const interestPointDoc = interestPointQuerySnapshot.docs.find(
          doc =>
            doc.data().creator === interestPoint.creator &&
            doc.data().name === interestPoint.name,
        );

        if (interestPointDoc) {
          // Actualizar el documento en la base de datos
          await updateDoc(interestPointDoc.ref, {
            isFavorite: interestPoints[index].isFavorite,
          });
        } else {
          // Si el documento no existe en la base de datos, crea uno nuevo
          await addDoc(this.interestPointsCollection, interestPoint);
        }
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async favoriteVehicle(vehicle) {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected;
  
    try {
      let vehicles = await AsyncStorage.getItem('vehicles');
      vehicles = vehicles ? JSON.parse(vehicles) : [];
  
      // Buscar el vehículo en el almacenamiento local usando 'creator' y 'plate' como clave
      const index = vehicles.findIndex(
        v => v.creator === vehicle.creator && v.plate === vehicle.plate
      );
  
      if (index !== -1) {
        // Invertir el estado de favorito, o establecerlo si no existe
        vehicles[index].isFavorite = !vehicles[index].isFavorite;
      } else {
        // Si no existe en local, no se puede marcar como favorito
        throw new Error('VehicleNotFoundException');
      }
  
      // Actualizar el almacenamiento local
      await AsyncStorage.setItem('vehicles', JSON.stringify(vehicles));
  
      if (isConnected) {
        // Actualizar el estado de favorito en la base de datos remota
        const vehicleQuerySnapshot = await getDocs(this.vehiclesCollection);
        const vehicleDoc = vehicleQuerySnapshot.docs.find(
          doc => doc.data().creator === vehicle.creator && doc.data().plate === vehicle.plate
        );
  
        if (vehicleDoc) {
          // Actualizar el documento en la base de datos
          await updateDoc(vehicleDoc.ref, { isFavorite: vehicles[index].isFavorite });
        } else {
          // Si el documento no existe en la base de datos, crea uno nuevo
          await addDoc(this.vehiclesCollection, vehicle);
        }
      }
  
      return true;
    } catch (error) {
      throw error;
    }
  };
  
}

export default CloudService;
