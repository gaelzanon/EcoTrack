class InterestPointController {
  constructor(cloudService) {
    this.cloudService = cloudService;
  }

  async registerInterestPoint(interestPoint) {
    // Aquí iría la validación del punto de interés antes de intentar registrar

    // try {
    //   // Usamos cloudService para añadir un punto de interés a la colección 'interestPoints'
    //   const docRef = await this.cloudService.addInterestPoint(interestPoint);
    //   return docRef;
    // } catch (error) {
    //   throw error;
    // }
    return 1;
  }

  // Otros métodos del controlador como borrar, actualizar, obtener puntos, etc.
}

export default InterestPointController;
