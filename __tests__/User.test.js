import User from '../models/User';
import authServiceMock from '../__mocks__/authServiceMock';
import UserController from '../controllers/UserController';

const userController = new UserController(authServiceMock);

describe('HU1: Como usuario no registrado en la aplicación quiero poder registrarme en la misma para poder utilizar sus servicios', () => {
  it('E1: Se crea el usuario correctamente con una contraseña válida', async () => {
    const user = new User('usuario@example.com', 'Password12');
    await expect(userController.register(user)).resolves.toBeTruthy();
    expect(authServiceMock.createUserWithEmailAndPassword).toHaveBeenCalledWith(
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
    expect(authServiceMock.signInWithEmailAndPassword).toHaveBeenCalledWith(
      'usuario@example.com',
      'Password12',
    );
  });

  it('E3: No se inicia sesión si la contraseña no es válida', async () => {
    const user = new User('usuario@example.com', 'Password');
    await expect(userController.login(user)).rejects.toThrow('InvalidPasswordException');
  });
});
