import Vehicle from '../../models/Vehicle';
import cloudServiceMock from '../../__mocks__/cloudServiceMock';
import VehicleController from '../../controllers/VehicleController';

const vehicleController = new VehicleController(cloudServiceMock);

describe('HU9: Como usuario quiero poder dar de alta un vehículo para poder emplearlo como método de transporte en mis rutas', () => {
  it('E1: Se crea el vehículo correctamente con datos válidos', async () => {
    const creatorEmail = 'usuario@gmail.com';

    const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 2020, 10, '1171MSL');

    await expect(vehicleController.registerVehicle(vehicle)).resolves.toEqual({
      id: 'random-doc-id',
      creator: creatorEmail,
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      averageConsumption: 10,
      plate: '1171MSL',
    });
  });

  it('E2: No se crea el vehículo si ya está dado de alta', async () => {
    const creatorEmail = 'usuario@gmail.com';
    const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 2020, 5, '8171MSL');

    await expect(vehicleController.registerVehicle(vehicle)).rejects.toThrow(
      'DuplicateVehicleException',
    );
  });

  it('E4: No se crea el vehículo si el año no es válido', async () => {
    const creatorEmail = 'usuario@gmail.com';
    const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 1500, 5, '1171MSL');

    await expect(vehicleController.registerVehicle(vehicle)).rejects.toThrow(
      'YearNotValidException',
    );
  });
});
