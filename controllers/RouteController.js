export default class RouteController {
    constructor(cloudService, routeService) {
        this.cloudService = cloudService;
        this.rutaService = routeService;
    }

    async getRoute(route) {
        if (route.origin.name === '' || route.destiny.name === '') {
            throw new Error('InvalidInterestPointException');
        }
        try {
            const journey = await this.rutaService.obtenerRuta(route.origin, route.destiny, route.mode, route.vehicle);
            return journey;
        } catch (error) {
            
            throw error;
        }
    }
}
