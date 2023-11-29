import ContextoFormulario from '../patrones/Strategy/ContextoFormulario';
import ValidacionLogin from '../patrones/Strategy/ValidacionLogin';
import ValidacionRegistro from '../patrones/Strategy/ValidacionRegistro';

class UserController {
  constructor(authService, cloudService) {
    this.authService = authService;
    this.cloudService = cloudService;
    this.contextoFormulario = new ContextoFormulario();
  }

  async register(formularioRegistro) {
    this.contextoFormulario.setEstrategiaValidacion(new ValidacionRegistro());
    try {
      this.contextoFormulario.validarFormulario(formularioRegistro);

      const result = await this.authService.createUserWithEmailAndPassword(
        formularioRegistro.email,
        formularioRegistro.user,
        formularioRegistro.password1,
      );
      return result;
    } catch (error) {
      // Reenviar la excepción tal como se recibe
      throw error;
    }
  }

  async login(formularioLogin) {
    this.contextoFormulario.setEstrategiaValidacion(new ValidacionLogin());
    try {
      this.contextoFormulario.validarFormulario(formularioLogin);

      const result = await this.authService.signInWithEmailAndPassword(
        formularioLogin.email,
        formularioLogin.password,
      );
      return result;
    } catch (error) {
      // Reenviar la excepción tal como se recibe
      throw error;
    }
  }

  async deleteUser(email) {
    //Consultar base de datos según email  enviado
    const existe = await this.cloudService.userExists(email);
    if (!existe) {
      const error = new Error('UserNotFoundException');
      error.code = 'UserNotFoundException';
      throw error;
    }

    try {
      const resultAuth = await this.authService.deleteUser();
      const resultDatabase = await this.cloudService.deleteUserInfo(email);
      return resultAuth && resultDatabase;
    } catch (error) {
      // Reenviar la excepción tal como se recibe
      throw error;
    }
  }
}

export default UserController;
