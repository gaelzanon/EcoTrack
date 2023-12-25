export default class RouteController {
  constructor(cloudService, routeService, carburanteService) {
    this.cloudService = cloudService;
    this.rutaService = routeService;
    this.carburanteService = carburanteService;
  }

  async getRoute(route) {
    if (
      route.origin.name === '' ||
      route.destiny.name === '' 
    ) {
      const error = new Error('InvalidInterestPointException');
      error.code = 'InvalidInterestPointException';
      throw error;
    }
    try {
      const journey = await this.rutaService.obtenerRuta(
        route.origin,
        route.destiny,
        route.mode,
        route.vehicle,
      );
      const price = await this.carburanteService.obtenerPrecioCarburante(journey)
      return {...journey, price};
    } catch (error) {
      throw error;
    }
  }
}
