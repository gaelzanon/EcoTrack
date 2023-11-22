class UserController {
  constructor(authService) {
    this.authService = authService;
  }
  validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
  validarPassword(password) {
    const longitudValida = password.length >= 6;
    const tieneDosNumeros = (password.match(/\d/g) || []).length >= 2;

    return longitudValida && tieneDosNumeros;
  }

  async register(user) {
    // Valida la contraseña antes de intentar registrar al usuario
    if (!this.validarEmail(user.email)) {
      
      const error = new Error('InvalidEmailException');
      error.code = 'InvalidEmailException';
      throw error;
    }
    if (!this.validarPassword(user.password)) {
      const error = new Error('InvalidPasswordException');
      error.code = 'InvalidPasswordException';
      throw error;
    }
    try {
      const result = await this.authService.createUserWithEmailAndPassword(
        user.email,
        user.password,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async login(user) {
    // Valida la contraseña antes de intentar loggear al usuario
    if (!this.validarEmail(user.email)) {
      throw new Error('InvalidEmailException')
    }
    if (!this.validarPassword(user.password)) {
      throw new Error('InvalidPasswordException')
    }
    try {
      const result = await this.authService.signInWithEmailAndPassword(
        user.email,
        user.password,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default UserController;
