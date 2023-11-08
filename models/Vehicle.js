class Vehicle {
  constructor(creator, brand, model, year, averageConsumption, cloudService) {
    this.creator = creator;
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.averageConsumption = averageConsumption;
    this.cloudService = cloudService; // Inyección de la dependencia
  }

  async register() {
    // Validar el año aquí y que no falte ningun dato
    const { cloudService, ...vehicleData } = this;
    // Usamos cloudService para añadir un vehículo a la colección 'vehicles'
    return this.cloudService.addVehicle(vehicleData);
  }
}

export default Vehicle;