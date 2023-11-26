import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseInstance from '../firebase';
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
const AsyncStorageContext = createContext(null);

export const AsyncStorageProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState(null);
  const [interestPoints, setInterestPoints] = useState(null);
  const [loaded, setLoaded] = useState(null);
  const loadInitialData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedVehicles = await AsyncStorage.getItem('vehicles');
      const storedInterestPoints = await AsyncStorage.getItem('interestPoints');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles));
      }
      if (storedInterestPoints) {
        setInterestPoints(JSON.parse(storedInterestPoints));
      }

      setLoaded(true);
    } catch (error) {
      console.error('Failed to load data from AsyncStorage:', error);
    }
  };

  const getFirebaseData = async () => {
    const db = firebaseInstance.db;
    const userEmail = user.email;

    const vehicleQuery = query(
      collection(db, 'production_vehicles'),
      where('creator', '==', userEmail),
    );
    const interestPointQuery = query(
      collection(db, 'production_interestPoints'),
      where('creator', '==', userEmail),
    );

    const firebaseVehicles = await getDocs(vehicleQuery).then(querySnapshot =>
      querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})),
    );
    const firebaseInterestPoints = await getDocs(interestPointQuery).then(
      querySnapshot =>
        querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})),
    );

    return {firebaseVehicles, firebaseInterestPoints};
  };

  const syncData = async (localVehicles, localInterestPoints) => {
    const {firebaseVehicles, firebaseInterestPoints} = await getFirebaseData();
    const db = firebaseInstance.db;
    //Si no existe coleccion local pero si online es que el usuario ha borrado aplicacion y ha vuelto a instalar
    if (!localVehicles && firebaseVehicles.length > 0) {
      //Hacer una copia de firebaseVehicles pero sin incluir el id en cada vehicle
      const vehiclesWithoutId = firebaseVehicles.map(({id, ...rest}) => rest);
      //guardarlo en asyncstorage y en el state
      await AsyncStorage.setItem('vehicles', JSON.stringify(vehiclesWithoutId));
      setVehicles(vehiclesWithoutId);
    }
    //Si no existe coleccion local pero si online es que el usuario ha borrado aplicacion y ha vuelto a instalar
    if (!localInterestPoints && firebaseInterestPoints.length > 0) {
      //Hacer una copia de firebaseInterestPoints pero sin incluir el id en cada InterestPoints
      const interestPointsWithoutId = firebaseInterestPoints.map(
        ({id, ...rest}) => rest,
      );
      //guardarlo en asyncstorage y en el state
      await AsyncStorage.setItem(
        'interestPoints',
        JSON.stringify(interestPointsWithoutId),
      );
      setInterestPoints(interestPointsWithoutId);
    }
    if (localVehicles) {
      // Sincronizar Vehículos
      for (const localVehicle of localVehicles) {
        const firebaseVehicle = firebaseVehicles.find(
          v => v.plate === localVehicle.plate,
        );

        if (!firebaseVehicle) {
          // Añadir a Firebase si no existe
          addDoc(collection(db, 'production_vehicles'), localVehicle);
        } else if (localVehicle.updatedAt > firebaseVehicle.updatedAt) {
          // Actualizar en Firebase si la versión local es más reciente
          updateDoc(
            doc(db, 'production_vehicles', firebaseVehicle.id),
            localVehicle,
          );
        }
      }

      // Eliminar de Firebase los que no están localmente
      for (const firebaseVehicle of firebaseVehicles) {
        if (!localVehicles.some(v => v.plate === firebaseVehicle.plate)) {
          deleteDoc(doc(db, 'production_vehicles', firebaseVehicle.id));
        }
      }
    }
    if (localInterestPoints) {
      // Sincronizar Puntos de Interés (solo añadir o eliminar, sin actualizar)
      for (const localInterestPoint of localInterestPoints) {
        if (
          !firebaseInterestPoints.some(
            ip => ip.name === localInterestPoint.name,
          )
        ) {
          addDoc(
            collection(db, 'production_interestPoints'),
            localInterestPoint,
          );
        }
      }

      for (const firebaseInterestPoint of firebaseInterestPoints) {
        if (
          !localInterestPoints.some(
            ip => ip.name === firebaseInterestPoint.name,
          )
        ) {
          deleteDoc(
            doc(db, 'production_interestPoints', firebaseInterestPoint.id),
          );
        }
      }
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const netInfo = await NetInfo.fetch();
      const isConnected = netInfo.isConnected;
      if (isConnected) {
        await syncData(vehicles, interestPoints);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  const value = {
    user,
    setUser: userData => {
      setUser(userData);
    },
    vehicles,
    setVehicles: vehicleData => {
      setVehicles(vehicleData);
    },
    interestPoints,
    setInterestPoints: interestPointData => {
      setInterestPoints(interestPointData);
    },
    loaded,
  };

  return (
    <AsyncStorageContext.Provider value={value}>
      {children}
    </AsyncStorageContext.Provider>
  );
};

export const useAsyncStorage = () => {
  return useContext(AsyncStorageContext);
};

export default AsyncStorageContext;
