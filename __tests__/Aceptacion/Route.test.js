import RouteController from '../../controllers/RouteController';
import Route from '../../models/Route';
import cloudService from '../../services/cloudService';
import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

const CloudService = new cloudService('test');
const routeController = new RouteController(CloudService);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

beforeEach(async () => {
    await CloudService.clearCollection('vehicles');
    await jest.clearAllMocks();
});

describe('HU13: Como usuario, dados dos lugares de interés y un método de movilidad, quiero obtener una ruta entre ambos lugares', () => {
    it('E1: Se obtiene la ruta correctamente', async () => {
      const creatorEmail = 'usuario@gmail.com';
  
      const route = new Route(creatorEmail, 'Castellón de la Plana', 'Villarreal', 'noVehiculo');
  
      await expect(routeController.getRoute(route.origin, route.destiny, route.vehicle)).resolves.toBeTruthy();
      await expect(AsyncStorage.getItem).toBeCalledWith('routes');
      await expect(AsyncStorage.setItem).toBeCalled();
    });
  
    it('E2: Uno de los lugares no existe', async () => {
      const creatorEmail = 'usuario@gmail.com';
      const route = new Route(creatorEmail, 'Castellón de la Plana', 'LugarNoExistente', 'sinVehiculo');
  
      await expect(routeController.getRoute(route.origin, route.destiny, route.vehicle)).rejects.toThrow(
        'InvalidInterestPoint',
      );
    });
  
    it('E3: Método de movilidad no válido', async () => {
      const creatorEmail = 'usuario@gmail.com';
      const route = new Route(creatorEmail, 'Castellón de la Plana', 'Villarreal', 'metodoMovilidadInvalido');
  
      await expect(routeController.getRoute(route.origin, route.destiny, route.vehicle)).rejects.toThrow(
        'InvalidMobilityMethod',
      );
    });

    it('E4: Ruta no disponible para método seleccionado', async () => {
        const creatorEmail = 'usuario@gmail.com';
        const route = new Route(creatorEmail, 'Castellón de la Plana', 'Santa Cruz de Tenerife', 'sinVehiculo');
    
        await expect(routeController.getRoute(route.origin, route.destiny, route.vehicle)).rejects.toThrow(
          'RouteNotAvailable',
        );
      });
  });