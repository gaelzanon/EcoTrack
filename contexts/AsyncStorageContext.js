// AsyncStorageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageContext = createContext(null);

export const AsyncStorageProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState(null);
  const [interestPoints, setInterestPoints] = useState(null);

  const loadInitialData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedVehicles = await AsyncStorage.getItem('vehicles');
      const storedInterestPoints = await AsyncStorage.getItem('interestPoints');

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedVehicles) setVehicles(JSON.parse(storedVehicles));
      if (storedInterestPoints) setInterestPoints(JSON.parse(storedInterestPoints));
    } catch (error) {
      console.error('Failed to load data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const value = {
    user,
    setUser: (userData) => {
      AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    },
    vehicles,
    setVehicles: (vehicleData) => {
      AsyncStorage.setItem('vehicles', JSON.stringify(vehicleData));
      setVehicles(vehicleData);
    },
    interestPoints,
    setInterestPoints: (interestPointData) => {
      AsyncStorage.setItem('interestPoints', JSON.stringify(interestPointData));
      setInterestPoints(interestPointData);
    }
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
