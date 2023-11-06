import User from '../models/User';
import InterestPoint from '../models/InterestPoint';
import Vehicle from '../models/Vehicle';

describe('HU1: Como usuario no registrado en la aplicación quiero poder registrarme en la misma para poder utilizar sus servicios', () => {
  it('E1: Se crea el usuario correctamente con una contraseña válida', async () => {
    const user = new User('usuario@example.com', 'Password12');
    await expect(user.register()).resolves.toBeTruthy();
  });

  it('E2: No se crea el usuario si la contraseña no es válida', async () => {
    const user = new User('usuario@example.com', 'pass');
    await expect(user.register()).rejects.toThrow('InvalidPasswordException');
  });
});

describe('HU2: Como usuario registrado quiero iniciar sesión en la aplicación para utilizar sus servicios', () => {
  it('E1: Se inicia sesión correctamente con credenciales válidas', async () => {
    const user = new User('usuario@example.com', 'Password12');
    await expect(user.login()).resolves.toBeTruthy();
  });

  it('E3: No se inicia sesión si la contraseña no es válida', async () => {
    const user = new User('usuario@example.com', 'pass');
    await expect(user.login()).rejects.toThrow('InvalidLoginException');
  });
});

describe('HU5: Como usuario quiero poder dar de alta un lugar de interés usando sus coordenadas', () => {
  it('E1: Se crea el lugar correctamente con coordenadas válidas', async () => {
    const interestPoint = new InterestPoint('Castellón de la Plana', 39, 0);
    await expect(interestPoint.register()).resolves.toEqual({
      name: 'Castellón de la Plana',
      latitude: 39,
      longitude: 0,
    });
  });

  it('E2: No se crea el lugar si el topónimo ya está dado de alta', async () => {
    const interestPoint = new InterestPoint('Castellón de la Plana', 39, 0);
    await expect(interestPoint.register()).rejects.toThrow(
      'DuplicatePlaceException',
    );
  });
});

describe('HU9: Como usuario quiero poder dar de alta un vehículo para poder emplearlo como método de transporte en mis rutas', () => {
  it('E1: Se crea el vehículo correctamente con datos válidos', async () => {
    const vehicle = new Vehicle('Toyota', 'Corolla', 2020, 5);
    await expect(vehicle.register()).resolves.toEqual({
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      averageConsumption: 5,
    });
  });

  it('E2: No se crea el vehículo si ya está dado de alta', async () => {
    const vehicle = new Vehicle('Toyota', 'Corolla', 2020, 5);
    await expect(vehicle.register()).rejects.toThrow(
      'DuplicateVehicleException',
    );
  });
});
