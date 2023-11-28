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
            origin:
              origin.latitude === undefined && origin.longitude === undefined
                ? origin.name
                : `${origin.latitude},${origin.longitude}`,
            destination:
              destiny.latitude === undefined && destiny.longitude === undefined
                ? destiny.name
                : `${destiny.latitude},${destiny.longitude}`,
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
      case 'electric':
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
    // Verifica si la respuesta es válida
    if (data.status !== 'OK' || !data.routes.length) {
      throw new Error('RouteNotAvailableException');
    }

    const firstRoute = data.routes[0];

    // Verifica si hay transbordadores en la ruta
    const hasFerry = firstRoute.legs.some(leg =>
      leg.steps.some(step => step.maneuver === 'ferry'),
    );

    if (hasFerry) {
      throw new Error('RouteNotAvailableException');
    }

    // Extrae las coordenadas de la ruta
    let coordinates = [];
    firstRoute.legs.forEach(leg => {
      leg.steps.forEach((step, index) => {
        // Solo agrega la posición de inicio en el primer paso
        if (index === 0) {
          coordinates.push({
            latitude: step.start_location.lat,
            longitude: step.start_location.lng,
          });
        }
        // Agrega la posición de fin de cada paso
        coordinates.push({
          latitude: step.end_location.lat,
          longitude: step.end_location.lng,
        });
      });
    });

    return {
      distance: firstRoute.legs[0].distance.text,
      duration: firstRoute.legs[0].duration.text,
      coordinates,
    };
  }
}
