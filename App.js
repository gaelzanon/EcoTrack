import 'react-native-gesture-handler';
import React, { useRef, useEffect } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PaperProvider, DefaultTheme} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import globalStyles from './styles';
//Views
import Login from './views/Login';
import Register from './views/Register';
import AddVehicle from './views/AddVehicle';
import AddInterestPoint from './views/AddInterestPoint';
import Home from './views/Home';
//Contexts
import {UserControllerProvider} from './contexts/UserControllerContext';
import {VehicleControllerProvider} from './contexts/VehicleControllerContext';
import { InterestPointControllerProvider } from './contexts/InterestPointControllerContext';
import { useAsyncStorage } from './contexts/AsyncStorageContext';
const App = () => {
  const Stack = createStackNavigator();
  const navigationRef = useRef();
  const { user } = useAsyncStorage();
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

  useEffect(() => {
    if (user) {
      // Si hay un usuario, redirige a Home
      navigationRef.current?.navigate('Home');
    }
  }, [user]);
  
  return (
    <PaperProvider theme={theme}>
      <InterestPointControllerProvider>
        <VehicleControllerProvider>
          <UserControllerProvider>
            <NavigationContainer ref={navigationRef}>
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
                  name="Home"
                  component={Home}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="AddVehicle"
                  component={AddVehicle}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="AddInterestPoint"
                  component={AddInterestPoint}
                  options={{headerShown: false}}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </UserControllerProvider>
        </VehicleControllerProvider>
      </InterestPointControllerProvider>
    </PaperProvider>
  );
};

export default App;
