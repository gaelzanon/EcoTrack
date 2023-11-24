export const mockCreateUserWithEmailAndPassword = jest.fn();
export const mockSignInWithEmailAndPassword = jest.fn();

// Simula el comportamiento de Firebase Auth para registrar un usuario
mockCreateUserWithEmailAndPassword.mockImplementation((email, password) => {
  // Simula un registro exitoso
  return Promise.resolve({user: {email, password}});
});

// Simula el comportamiento de Firebase Auth para iniciar sesión
mockSignInWithEmailAndPassword.mockImplementation((email, password) => {
  // En este punto, simulas que la base de datos tiene un usuario con ese email y password
  // Simula un inicio de sesión exitoso
  return Promise.resolve({user: {email, password}});
});

const authServiceMock = {
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
};

export default authServiceMock;
