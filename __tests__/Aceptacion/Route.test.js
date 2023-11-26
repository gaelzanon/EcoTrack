import RouteController from '../../controllers/RouteController';
import Route from '../../models/Route';
import Vehicle from '../../models/Vehicle';
import InterestPoint from '../../models/InterestPoint';
import cloudService from '../../services/cloudService';
import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

const CloudService = new cloudService('test');
const routeController = new RouteController(CloudService);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('HU13: Como usuario, dados dos lugares de interés y un método de movilidad, quiero obtener una ruta entre ambos lugares', () => {
    it('E1: Se obtiene la ruta correctamente', async () => {
      const creatorEmail = 'usuario@gmail.com';
      const interestPoint1 = new InterestPoint(creatorEmail, 'Villarreal', 39.9333300, -0.1000000);
      const interestPoint2 = new InterestPoint(creatorEmail, 'Castellón de la Plana', 39.98567, -0.04935);
      const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 2020, 10, '1171MSL', 'gasoline');
      const route = new Route(creatorEmail, interestPoint1, interestPoint2, vehicle);
  
      await expect(routeController.getRoute(route.origin, route.destiny, route.vehicle)).resolves.toBeTruthy();

    });
  
    it('E2: Uno de los lugares no existe', async () => {
      const creatorEmail = 'usuario@gmail.com';
      const interestPoint1 = new InterestPoint(creatorEmail, 'Villarreal', 39.9333300, -0.1000000);
      const interestPoint2 = null
      const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 2020, 10, '1171MSL', 'gasoline');
      const route = new Route(creatorEmail, interestPoint1, interestPoint2, vehicle);
  
      await expect(routeController.getRoute(route.origin, route.destiny, route.vehicle)).rejects.toThrow(
        'InvalidInterestPointException',
      );
    });
  
    it('E4: Ruta no disponible para método seleccionado', async () => {
      const creatorEmail = 'usuario@gmail.com';
      const interestPoint1 = new InterestPoint(creatorEmail, 'Villarreal', 39.9333300, -0.1000000);
      const interestPoint2 = new InterestPoint(creatorEmail, 'Las Palmas de Gran Canaria', 28.09973, -15.41343);
      const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 2020, 10, '1171MSL', 'gasoline');
      const route = new Route(creatorEmail, interestPoint1, interestPoint2, vehicle);
    
      await expect(routeController.getRoute(route.origin, route.destiny, route.vehicle)).rejects.toThrow(
          'RouteNotAvailableException',
      );
    });
  });