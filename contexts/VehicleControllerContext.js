// VehicleControllerContext.js
import React, { createContext, useContext } from 'react';
import VehicleController from '../controllers/VehicleController';
import authService from '../services/authService';

// Crear el contexto
const VehicleControllerContext = createContext(null);

// Crear un proveedor para el contexto
export const VehicleControllerProvider = ({ children }) => {
  
  //TODO: Crear una instancia de VehicleController

  return (
    <VehicleControllerContext.Provider value={vehicleController}>
      {children}
    </VehicleControllerContext.Provider>
  );
};

// Hook personalizado para usar VehicleController
export const useVehicleController = () => {
  return useContext(VehicleControllerContext);
};

export default VehicleControllerContext;
