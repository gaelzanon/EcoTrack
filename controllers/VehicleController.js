class VehicleController {
  constructor(cloudService) {
    this.cloudService = cloudService;
  }

  validarAnoVehiculo(ano) {
    const anoActual = new Date().getFullYear();
    return ano >= 1990 && ano <= anoActual;
  }

  async registerVehicle(vehicle) {
    // Validación del vehículo antes de intentar registrar
    if (!this.validarAnoVehiculo(vehicle.year)) {
      throw new Error("YearNotValidException");
    }

    try {
      // Usamos cloudService para añadir un vehículo a la colección 'vehicles'
      const docRef = await this.cloudService.addVehicle(vehicle);
      return docRef;
    } catch (error) {
      throw error;
    }
  }

  // Otros métodos del controlador como borrar, actualizar, obtener vehículos, etc.

  async getVehicles() {
    const list = await this.cloudService.getVehicles();
    return list;
  }

  async removeVehicle(vehicle) {
    //Consultar base de datos según punto de interés enviado
    const existe = await this.cloudService.vehicleExists(vehicle.creator, vehicle.plate);
    if (!existe) {
      const error = new Error('VehicleNotFoundException');
      error.code = 'VehicleNotFoundException';
      throw error;
    }

    try {
      const resultDatabase = await this.cloudService.deleteVehicle(vehicle);
      return resultDatabase;
    } catch (error) {
      // Reenviar excepción recibida
      throw error;
    }
  }
  
}

export default VehicleController;
