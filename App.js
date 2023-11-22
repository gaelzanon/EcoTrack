import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PaperProvider, DefaultTheme} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import globalStyles from './styles';
//Views
import Login from './views/Login';
import Register from './views/Register';
import AddVehicle from './views/AddVehicle';

//Contexts
import {UserControllerProvider} from './contexts/UserControllerContext';
import {VehicleControllerProvider} from './contexts/VehicleControllerContext';

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
    <VehicleControllerProvider>
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
              <Stack.Screen
                name="AddVehicle"
                component={AddVehicle}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </UserControllerProvider>
    </VehicleControllerProvider>
  );
};

export default App;
