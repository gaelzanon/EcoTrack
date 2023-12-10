import Vehicle from '../../models/Vehicle';
import VehicleController from '../../controllers/VehicleController';
import cloudService from '../../services/cloudService';
import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

const CloudService = new cloudService('test');
const vehicleController = new VehicleController(CloudService);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

beforeEach(async () => {
  await CloudService.clearCollection('vehicles');
  await jest.clearAllMocks();
  await AsyncStorage.removeItem('vehicles')
});

describe('HU9: Como usuario quiero poder dar de alta un vehículo para poder emplearlo como método de transporte en mis rutas', () => {
  it('E1: Se crea el vehículo correctamente con datos válidos', async () => {
    const creatorEmail = 'usuario@gmail.com';

    const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 2020, 10, '1171MSL', 'gasoline');

    await expect(vehicleController.registerVehicle(vehicle)).resolves.toBeTruthy();
    await expect(AsyncStorage.getItem).toBeCalledWith('vehicles');
    await expect(AsyncStorage.setItem).toBeCalled();
  });

  it('E2: No se crea el vehículo si ya está dado de alta', async () => {
    const creatorEmail = 'usuario@gmail.com';
    const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 2020, 5, '8171MSL', 'gasoline');

    // Configura el mock de AsyncStorage para simular que ya existe el punto de interés
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([vehicle]));

    // Intenta agregar el mismo punto de interés
    await expect(vehicleController.registerVehicle(vehicle)).rejects.toThrow('DuplicateVehicleException');

    // Verifica que se haya llamado a getItem y setItem correctamente
    await expect(AsyncStorage.getItem).toBeCalledWith('vehicles');
    await expect(AsyncStorage.setItem).not.toBeCalled();
  });

  it('E4: No se crea el vehículo si el año no es válido', async () => {
    const creatorEmail = 'usuario@gmail.com';
    const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 1500, 5, '1171MSL', 'gasoline');

    await expect(vehicleController.registerVehicle(vehicle)).rejects.toThrow(
      'YearNotValidException',
    );
  });
});


describe('HU10:  Como usuario quiero poder consultar la lista de vehículos dados de alta.', () => {
  it('E1: Se muestra la lista de vehiculos disponibles si los hay.', async () => {
    const creatorEmail = 'usuario@gmail.com';
    const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 2020, 5, '8171MSL', 'gasoline');
    await vehicleController.registerVehicle(vehicle)

    const storedData = JSON.parse(await AsyncStorage.getItem('vehicles'));
    expect(storedData).toEqual([
      vehicle
    ]);
  });

  it('E2: No se muestra la lista de vehiculos registrados si no los hay.', async () => {

    const storedData = JSON.parse(await AsyncStorage.getItem('vehicles'));
    expect(storedData).toEqual(null);
  });
});
