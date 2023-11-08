class User {
  constructor(email, password, authService) {
    this.email = email;
    this.password = password;
    this.authService = authService; // Inyectamos la dependencia del servicio de autenticación
  }

  async register() {
    // Aquí falta añadir lógica adicional para validar el password (minimo 6 carac incluyendo 2 num)
    try {
      const result = await this.authService.createUserWithEmailAndPassword(this.email, this.password);
      return result;
    } catch (error) {
      throw new Error('RegistrationFailed', error);
    }
  }

  async login() {
    try {
      const result = await this.authService.signInWithEmailAndPassword(this.email, this.password);
      return result;
    } catch (error) {
      throw new Error('InvalidLoginException', error);
    }
  }
}

export default User;
