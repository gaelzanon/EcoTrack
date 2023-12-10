class InterestPointController {
  constructor(cloudService, geocodingService) {
    this.cloudService = cloudService;
    this.geocodingService = geocodingService;
  }

  validarCoordenadas(latitud, longitud) {
    const esLatitudValida = latitud >= -90 && latitud <= 90;
    const esLongitudValida = longitud >= -180 && longitud <= 180;
    return esLatitudValida && esLongitudValida;
  }

  async registerInterestPoint(interestPoint) {
    // Validación del punto de interés antes de intentar registrar
    if (
      !this.validarCoordenadas(interestPoint.latitude, interestPoint.longitude)
    ) {
      throw new Error('InvalidCoordinatesException');
    }

    try {
      // Usamos cloudService para añadir un punto de interés a la colección 'interestPoints'
      const docRef = await this.cloudService.addInterestPoint(interestPoint);
      return docRef;
    } catch (error) {
      throw error;
    }
  }

  async registerInterestPointToponym(interestPoint) {
    // Validación del punto de interés antes de intentar registrar
    if (interestPoint.name === '' || interestPoint.name.length < 4) {
      const error = new Error('InvalidToponymException');
      error.code = 'InvalidToponymException';
      throw error;
    }

    try {
      const coords = await this.geocodingService.obtenerCoordenadas(interestPoint.name)
      const newIp = {...interestPoint, latitude:coords.latitude, longitude:coords.longitude}
      // Usamos cloudService para añadir un punto de interés a la colección 'interestPoints'
      const docRef = await this.cloudService.addInterestPoint(newIp);
      return docRef;
    } catch (error) {
      throw error;
    }
  }

  async getInterestPoints() {
    return 0
  }
  // Otros métodos del controlador como borrar, actualizar, obtener puntos, etc.
}

export default InterestPointController;
