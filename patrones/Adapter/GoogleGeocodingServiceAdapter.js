import axios from 'axios';
import GeocodingService from './GeocodingService';
import Config from 'react-native-config';

export default class GoogleGeocodingServiceAdapter extends GeocodingService {
  constructor() {
    super();
    this.apiKey = Config.GOOGLE_MAPS_API_KEY;
  }

  async obtenerCoordenadas(toponym) {
    const error = new Error('ToDOException');
    error.code = 'ToDOException';
    throw error;
  }
}
