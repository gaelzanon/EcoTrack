class InterestPoint {
  constructor(creator, name, latitude, longitude, cloudService) {
    this.creator = creator;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.cloudService = cloudService; // Inyección de la dependencia
  }

  async register() {
    // Validar las coordenadas aquí y que no falte ningun dato
    const { cloudService, ...interestPointData } = this;
    // Usamos cloudService para añadir un punto de interés a la colección 'interestPoints'
    return this.cloudService.addInterestPoint(interestPointData);
  }
}

export default InterestPoint;