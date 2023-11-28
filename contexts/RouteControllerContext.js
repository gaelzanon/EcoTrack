import React, { createContext, useContext } from 'react';
import RouteController from '../controllers/RouteController';
import cloudService from '../services/cloudService';
import GoogleDirectionsServiceAdapter from '../patrones/Adapter/GoogleDirectionsServiceAdapter';

// Crear el contexto
const RouteControllerContext = createContext(null);

// Crear un proveedor para el contexto
export const RouteControllerProvider = ({ children }) => {
  // Crear una instancia de RouteController
  const cloudProduction = new cloudService('production')
  const googleDirectionService = new GoogleDirectionsServiceAdapter();
  const routeController = new RouteController(cloudProduction, googleDirectionService);

  return (
    <RouteControllerContext.Provider value={routeController}>
      {children}
    </RouteControllerContext.Provider>
  );
};

// Hook personalizado para usar RouteController
export const useRouteController = () => {
  return useContext(RouteControllerContext);
};

export default RouteControllerContext;
