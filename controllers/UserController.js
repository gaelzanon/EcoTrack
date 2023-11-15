class UserController {
  constructor(authService) {
    this.authService = authService;
  }

  async register(user) {
    // Valida la contraseña antes de intentar registrar al usuario
    
    // try {
    //   const result = await this.authService.createUserWithEmailAndPassword(
    //     user.email,
    //     user.password,
    //   );
    //   return result;
    // } catch (error) {
    //   throw error;
    // }
    return 1;
  }

  async login(user) {
    // Valida la contraseña antes de intentar loggear al usuario
   
    // try {
    //   const result = await this.authService.signInWithEmailAndPassword(
    //     user.email,
    //     user.password,
    //   );
    //   return result;
    // } catch (error) {
    //   throw error;
    // }
    return 1;
  }
}

export default UserController;
