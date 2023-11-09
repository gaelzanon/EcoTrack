class VehicleController {
  constructor(cloudService) {
    this.cloudService = cloudService;
  }

  async registerVehicle(vehicle) {
    // Aquí iría la validación del vehículo antes de intentar registrar

    try {
      // Usamos cloudService para añadir un vehículo a la colección 'vehicles'
      const docRef = await this.cloudService.addVehicle(vehicle);
      return docRef;
    } catch (error) {
      throw error;
    }
  }

  // Otros métodos del controlador como borrar, actualizar, obtener vehículos, etc.
}

export default VehicleController;
