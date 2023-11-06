class Vehicle {
  constructor(brand, model, year, averageConsumption) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.averageConsumption = averageConsumption;
  }

  async register() {
    // Validar el año aquí
    // Aquí iría la lógica para añadir un vehículo en Firebase
  }
}

export default Vehicle;
