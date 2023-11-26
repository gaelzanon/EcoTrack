import ContextoFormulario from '../patrones/Strategy/ContextoFormulario';
import ValidacionLogin from '../patrones/Strategy/ValidacionLogin';
import ValidacionRegistro from '../patrones/Strategy/ValidacionRegistro';

class UserController {
  constructor(authService) {
    this.authService = authService;
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

  async deleteUser(username) {
    //TODO: Consultar base de datos según nombre usuario enviado

    //TODO: Eliminar cuenta
    return null;

    try {

      const result = await this.authService.deleteUser();
      return result;
    } catch (error) {
      // Reenviar la excepción tal como se recibe
      throw error;
    }
  }
}

export default UserController;
