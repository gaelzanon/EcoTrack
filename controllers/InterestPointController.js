class InterestPointController {
  constructor(cloudService) {
    this.cloudService = cloudService;
  }

  validarCoordenadas(latitud, longitud) {
    const esLatitudValida = latitud >= -90 && latitud <= 90;
    const esLongitudValida = longitud >= -180 && longitud <= 180;
    return esLatitudValida && esLongitudValida;
  }

  validarToponimo(interestPoint) {
    // Comprobar topónimo
    return null;
  }

  async registerInterestPoint(interestPoint) {
    // Validación del punto de interés antes de intentar registrar
    if (!this.validarCoordenadas(interestPoint.latitude, interestPoint.longitude)) {
      throw new Error("InvalidCoordinatesException");
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
    if (!this.validarToponimo(interestPoint)) {
      // throw new Error("InvalidToponymException");
      return null;
    }

    try {
      // Usamos cloudService para añadir un punto de interés a la colección 'interestPoints'
      const docRef = await this.cloudService.addInterestPoint(interestPoint);
      return docRef;
    } catch (error) {
      throw error;
    }
  }

  // Otros métodos del controlador como borrar, actualizar, obtener puntos, etc.
}

export default InterestPointController;
