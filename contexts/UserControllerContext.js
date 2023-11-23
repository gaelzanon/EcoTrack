// UserControllerContext.js
import React, { createContext, useContext } from 'react';
import UserController from '../controllers/UserController';
import authService from '../services/authService';

// Crear el contexto
const UserControllerContext = createContext(null);

// Crear un proveedor para el contexto
export const UserControllerProvider = ({ children }) => {
  // Crear una instancia de UserController
  const userController = new UserController(authService('production'));

  return (
    <UserControllerContext.Provider value={userController}>
      {children}
    </UserControllerContext.Provider>
  );
};

// Hook personalizado para usar UserController
export const useUserController = () => {
  return useContext(UserControllerContext);
};

export default UserControllerContext;
