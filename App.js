import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import globalStyles from './styles';
import Login from './views/Login';
import Register from './views/Register';
import { UserControllerProvider } from './contexts/UserControllerContext'; // Importa el proveedor del contexto

const App = () => {
  const Stack = createStackNavigator();
  const theme = {
    ...DefaultTheme, // Usa el DefaultTheme como base
    colors: {
      ...DefaultTheme.colors,
      primary: '#2f9f82',
      accent: '#013437',
      text: '#000000',
      placeholder: 'black',
    },
  };

  return (
    <UserControllerProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {...globalStyles.black},
              headerTintColor: globalStyles.white.backgroundColor,
              animationEnabled: false, // Deshabilita la animación de transición
            }}>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </UserControllerProvider>
  );
};

export default App;
