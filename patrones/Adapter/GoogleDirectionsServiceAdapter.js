import axios from 'axios';
import RutaService from './RutaService';
import Config from 'react-native-config';

export default class GoogleDirectionsServiceAdapter extends RutaService {
  constructor() {
    super();
    this.apiKey = Config.GOOGLE_MAPS_API_KEY;
  }

  async obtenerRuta(origin, destination, mode, vehicle) {
    try {
      // Construye los objetos Waypoint para origin y destination
      const waypointOrigin = this.buildWaypoint(origin);
      const waypointDestination = this.buildWaypoint(destination);
  
      // Configura el tipo de vehículo
      const travelMode = this.getTravelMode(vehicle.type);
  
      // Realiza la solicitud a la API de Google Maps directions
      const response = await axios.post(
        `https://routes.googleapis.com/directions/v2:computeRoutes`,
        {
          origin: waypointOrigin,
          destination: waypointDestination,
          travelMode: travelMode,
          computeAlternativeRoutes: true,
          polylineQuality:'HIGH_QUALITY'
        },
        {
          params: {
            key: this.apiKey,
          },
          headers: {
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
          },
        }
      );
  
      return this.formatRouteResponse(response.data);
    } catch (error) {
      throw error;
    }
  }
  
  // Método para construir un objeto Waypoint
  buildWaypoint(location) {
    if (location.latitude !== undefined && location.longitude !== undefined) {
      return {
        location: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        }
      };
    } else  {
      return { address: location.name };
    }
  }
  
  // Método para determinar el modo de viaje
  getTravelMode(vehicleType) {
    switch (vehicleType) {
      case 'electric':
      case 'gasoline':
      case 'diesel':
        return 'DRIVE';
      case 'bike':
        return 'BICYCLE';
      case 'walking':
        return 'WALK';
      default:
        return 'DRIVE';
    }
  }
  
  

  formatRouteResponse(data) {
    // Verifica si la respuesta es válida
    if (!data.routes || data.routes.length === 0) {
      throw new Error('RouteNotAvailableException');
    }
  
    // Toma la primera ruta (la más recomendada)
    const firstRoute = data.routes[0];
  
    // Decodifica la polyline. 
    const decodedPolyline = this.decodePolyline(firstRoute.polyline.encodedPolyline);
  
    // Construye el objeto de respuesta
    const response = {
      distance: firstRoute.distanceMeters, // Distancia en metros
      duration: firstRoute.duration, // Duración en segundos
      coordinates: decodedPolyline // Coordenadas de la ruta
    };
  
    return response;
  }
  
  // Método para decodificar una polyline codificada de Google Maps
  decodePolyline(encoded) {
    if (!encoded) {
      return [];
    }
  
    const poly = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;
  
    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
  
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
  
      poly.push({latitude: (lat / 1E5), longitude: (lng / 1E5)});
    }
  
    return poly;
  }
  
}
