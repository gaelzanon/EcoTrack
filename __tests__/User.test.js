import User from '../models/User';
import authServiceMock from '../__mocks__/authServiceMock';

describe('HU1: Como usuario no registrado en la aplicación quiero poder registrarme en la misma para poder utilizar sus servicios', () => {
  it('E1: Se crea el usuario correctamente con una contraseña válida', async () => {
    const user = new User('usuario@example.com', 'Password12', authServiceMock);
    await expect(user.register()).resolves.toBeTruthy();
    expect(authServiceMock.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      'usuario@example.com',
      'Password12',
    );
  });

  it('E2: No se crea el usuario si la contraseña no es válida', async () => {
    const user = new User('usuario@example.com', 'Password', authServiceMock);
    await expect(user.register()).rejects.toThrow(
      'RegistrationFailed',
    );
    expect(authServiceMock.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      'usuario@example.com',
      'Password',
    );
  });
});

describe('HU2: Como usuario registrado quiero iniciar sesión en la aplicación para utilizar sus servicios', () => {
  it('E1: Se inicia sesión correctamente con credenciales válidas', async () => {
    const user = new User('usuario@example.com', 'Password12', authServiceMock);
    await expect(user.login()).resolves.toBeTruthy();
    expect(authServiceMock.signInWithEmailAndPassword).toHaveBeenCalledWith(
      'usuario@example.com',
      'Password12',
    );
  });

  it('E3: No se inicia sesión si la contraseña no es válida', async () => {
    const user = new User('usuario@example.com', 'Password', authServiceMock);
    await expect(user.login()).rejects.toThrow('InvalidLoginException');
  });
});
