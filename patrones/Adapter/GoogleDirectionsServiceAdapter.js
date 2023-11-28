import axios from 'axios';
import RutaService from './RutaService';
import Config from 'react-native-config';

export default class GoogleDirectionsServiceAdapter extends RutaService {
  constructor() {
    super();
    this.apiKey = Config.GOOGLE_MAPS_API_KEY;
  }

  async obtenerRuta(origin, destiny, mode, vehicle) {
    try {
      const vehicleType = this.getVehicleType(vehicle.type);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json`,
        {
          params: {
            origin: `${origin.latitude},${origin.longitude}`,
            destination: `${destiny.latitude},${destiny.longitude}`,
            mode: vehicleType,
            alternatives: true,
            avoid: 'ferries', //aunque este esto puesto , si la unica ruta disponible incluye ferries la va a devolver igual
            key: this.apiKey,
          },
        },
      );

      return this.formatRouteResponse(response.data);
    } catch (error) {
      throw error;
    }
  }

  getVehicleType(vehicleType) {
    // Transforma el tipo de vehículo al formato esperado por la API de Google Maps
    switch (vehicleType) {
      case 'electronic':
      case 'gasoline':
      case 'diesel':
        return 'driving';
      case 'bike':
        return 'bicycling';
      case 'walking':
        return 'walking';
      default:
        return 'driving';
    }
  }

  formatRouteResponse(data) {
    // Formatea la respuesta de la API de Google Maps al formato deseado
    if (data.status !== 'OK' || !data.routes.length) {
      throw new Error('RouteNotAvailableException');
    }

    // Verificar solo la primera ruta
    const firstRoute = data.routes[0];
    const hasFerry = firstRoute.legs.some(leg =>
      leg.steps.some(step => step.maneuver === 'ferry'),
    );

    if (hasFerry) {
        throw new Error('RouteNotAvailableException');
    }

    const route = data.routes[0];
    const leg = route.legs[0];
    return {
      distance: leg.distance.text,
      duration: leg.duration.text,
      coordinates: leg.steps.map(step => ({
        start: step.start_location,
        end: step.end_location,
      })),
    };
  }
}
