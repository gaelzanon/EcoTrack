import User from '../../models/User';
import UserController from '../../controllers/UserController';
import authService from '../../services/authService';
import cloudService from '../../services/cloudService';
const AuthService = new authService('test');
const CloudService = new cloudService('test');
const userController = new UserController(AuthService);


jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);


beforeEach(async () => {
  await CloudService.clearCollection('users');
  await jest.clearAllMocks();
});


describe('HU1: Como usuario no registrado en la aplicación quiero poder registrarme en la misma para poder utilizar sus servicios', () => {
  it('E1: Se crea el usuario correctamente con una contraseña válida', async () => {
    const user = new User('usuario@example.com', 'Password12');
    await expect(userController.register(user)).resolves.toBeTruthy();
    await AuthService.deleteUser()
  });

  it('E2: No se crea el usuario si la contraseña no es válida', async () => {
    const user = new User('usuario@example.com', 'Password');
    await expect(userController.register(user)).rejects.toThrow(
      'InvalidPasswordException',
    );
  });
});

describe('HU2: Como usuario registrado quiero iniciar sesión en la aplicación para utilizar sus servicios', () => {
  it('E1: Se inicia sesión si credenciales son validas', async () => {
    const user = new User('usuario2@example.com', 'Password12');
    await userController.register(user)
    await expect(userController.login(user)).resolves.toBeTruthy()
    await AuthService.deleteUser()
  });

  it('E3: No se inicia sesión si la contraseña no es válida', async () => {
    const user = new User('usuario@example.com', 'Password');
    await expect(userController.login(user)).rejects.toThrow('InvalidPasswordException');
  });
});
