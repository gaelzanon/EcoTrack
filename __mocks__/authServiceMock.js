export const mockCreateUserWithEmailAndPassword = jest.fn();
export const mockSignInWithEmailAndPassword = jest.fn();

// Simula el comportamiento de Firebase Auth para registrar un usuario
mockCreateUserWithEmailAndPassword.mockImplementation((email, password) => {
  if (password.length < 6 ) {
    return Promise.reject(new Error('La contraseña debe ser de al menos 6 caracteres.'));
  } else {
    // Simula un registro exitoso
    return Promise.resolve({ user: { email, password } });
  }
});

// Simula el comportamiento de Firebase Auth para iniciar sesión
mockSignInWithEmailAndPassword.mockImplementation((email, password) => {
  // En este punto, simulas que la base de datos tiene un usuario con este email y password
  if (email === 'usuario@example.com' && password === 'Password12') {
    // Simula un inicio de sesión exitoso
    return Promise.resolve({ user: { email, password } });
  } else {
    // Simula un fallo en el inicio de sesión
    return Promise.reject(new Error('Credenciales inválidas.'));
  }
});

const authServiceMock = {
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
};

export default authServiceMock;
