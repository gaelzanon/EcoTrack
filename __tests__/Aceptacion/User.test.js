import User from '../../models/User';

import UserController from '../../controllers/UserController';
import authService from '../../services/authService';
const userController = new UserController(authService('test'));

describe('HU1: Como usuario no registrado en la aplicación quiero poder registrarme en la misma para poder utilizar sus servicios', () => {
  it('E1: Se crea el usuario correctamente con una contraseña válida', async () => {
    const user = new User('usuario@example.com', 'Password12');
    await expect(userController.register(user)).resolves.toBeTruthy();
    expect(authService.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      'usuario@example.com',
      'Password12',
    );
  });

  it('E2: No se crea el usuario si la contraseña no es válida', async () => {
    const user = new User('usuario@example.com', 'Password');
    await expect(userController.register(user)).rejects.toThrow(
      'InvalidPasswordException',
    );
  });
});

describe('HU2: Como usuario registrado quiero iniciar sesión en la aplicación para utilizar sus servicios', () => {
  it('E1: Se inicia sesión correctamente con credenciales válidas', async () => {
    const user = new User('usuario@example.com', 'Password12');
    await expect(userController.login(user)).resolves.toBeTruthy();
    expect(authService.signInWithEmailAndPassword).toHaveBeenCalledWith(
      'usuario@example.com',
      'Password12',
    );
  });

  it('E3: No se inicia sesión si la contraseña no es válida', async () => {
    const user = new User('usuario@example.com', 'Password');
    await expect(userController.login(user)).rejects.toThrow('InvalidPasswordException');
  });
});
