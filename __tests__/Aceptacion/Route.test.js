import RouteController from '../../controllers/RouteController';
import Route from '../../models/Route';
import Vehicle from '../../models/Vehicle';
import InterestPoint from '../../models/InterestPoint';
import cloudService from '../../services/cloudService';
import GoogleDirectionsServiceAdapter from '../../patrones/Adapter/GoogleDirectionsServiceAdapter';
import DatosGobServiceAdapter from '../../patrones/Adapter/DatosGobServiceAdapter';
const CloudService = new cloudService('test');
const routeService = new GoogleDirectionsServiceAdapter();
const carburanteService = new DatosGobServiceAdapter();
const routeController = new RouteController(CloudService, routeService, carburanteService);
/*
//Estos tests seguramente fallen en github ya que no comiteamos nuestra apiKey al repositorio, es lo que se espera
describe('HU13: Como usuario, dados dos lugares de interés y un método de movilidad, quiero obtener una ruta entre ambos lugares', () => {
    it('E1: Se obtiene la ruta correctamente', async () => {
      const creatorEmail = 'usuario@gmail.com';
      const interestPoint1 = new InterestPoint(creatorEmail, 'Villarreal', 39.9333300, -0.1000000);
      const interestPoint2 = new InterestPoint(creatorEmail, 'Castellón de la Plana', 39.98567, -0.04935);
      const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 2020, 10, '1171MSL', 'gasoline');
      const route = new Route(creatorEmail, interestPoint1, interestPoint2, vehicle, 'fastest');
  
      await expect(routeController.getRoute(route)).resolves.toBeTruthy();

    });
  
    it('E2: Uno de los lugares no existe', async () => {
      const creatorEmail = 'usuario@gmail.com';
      const interestPoint1 = new InterestPoint(creatorEmail, 'Villarreal', 39.9333300, -0.1000000);
      const interestPoint2 = new InterestPoint(creatorEmail, '', undefined, undefined)
      const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 2020, 10, '1171MSL', 'gasoline');
      const route = new Route(creatorEmail, interestPoint1, interestPoint2, vehicle, 'shortest');
  
      await expect(routeController.getRoute(route)).rejects.toThrow(
        'InvalidInterestPointException',
      );
    });
  

});
  */
describe('HU14: Como usuario quiero conocer el coste asociado a la realización de una ruta en coche (precio de combustible) para saber cuánto me va a costar.', () => {
  it('E1: Se calcula el coste correctamente', async () => {
    const creatorEmail = 'usuario@gmail.com';
    const interestPoint1 = new InterestPoint(creatorEmail, 'Villarreal', 39.9333300, -0.1000000);
    const interestPoint2 = new InterestPoint(creatorEmail, 'Castellón de la Plana', 39.98567, -0.04935);
    const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 2020, 10, '1171MSL', 'gasoline');
    const route = new Route(creatorEmail, interestPoint1, interestPoint2, vehicle, 'fastest');

    const journey = await routeController.getRoute(route)
    // Verifica que cost no es null y es un número
    expect(journey.price).not.toBeNull();
    expect(typeof journey.price).toEqual('number');

  });

  it('E2: Vehiculo no válido', async () => {
    const creatorEmail = 'usuario@gmail.com';
    const interestPoint1 = new InterestPoint(creatorEmail, 'Villarreal', 39.9333300, -0.1000000);
    const interestPoint2 = new InterestPoint(creatorEmail, 'Castellón de la Plana', 39.98567, -0.04935);
    const vehicle = new Vehicle(creatorEmail, 'Toyota', 'Corolla', 2020, 10, '1171MSL', 'plutonium');
    const route = new Route(creatorEmail, interestPoint1, interestPoint2, vehicle, 'shortest');

    await expect(routeController.getRoute(route)).rejects.toThrow(
      'InvalidVehicleException',
    );
  });


});