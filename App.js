import 'react-native-gesture-handler';
import React, {useRef, useEffect} from 'react';
import {BackHandler} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {PaperProvider, DefaultTheme} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import globalStyles from './styles';
import RNBootSplash from 'react-native-bootsplash';
import HeaderDropdown from './components/HeaderDropdown';

//Views
import Login from './views/Login';
import Register from './views/Register';
import AddVehicle from './views/AddVehicle';
import AddInterestPoint from './views/AddInterestPoint';
import Home from './views/Home';
import RouteFinder from './views/RouteFinder';
//Contexts
import {UserControllerProvider} from './contexts/UserControllerContext';
import {VehicleControllerProvider} from './contexts/VehicleControllerContext';
import {InterestPointControllerProvider} from './contexts/InterestPointControllerContext';
import {RouteControllerProvider} from './contexts/RouteControllerContext';
import {useAsyncStorage} from './contexts/AsyncStorageContext';

const App = () => {
  const Stack = createStackNavigator();
  const navigationRef = useRef(null);

  const {user, loaded} = useAsyncStorage();

  useEffect(() => {
    if (loaded) {
      RNBootSplash.hide({fade: true, duration: 500});
    }
  }, [loaded]);

  useEffect(() => {
    // Esto es para que no volvamos a login si pulsamos hacia atras en Home
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (
          navigationRef.current &&
          navigationRef.current.getCurrentRoute().name === 'Home'
        ) {
          return true;
        }
      },
    );

    return () => backHandler.remove();
  }, []);
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
      <RouteControllerProvider>
        <InterestPointControllerProvider>
          <VehicleControllerProvider>
            <UserControllerProvider>
              <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                  screenOptions={{
                    headerStyle: {...globalStyles.black},
                    headerTintColor: globalStyles.white.backgroundColor,
                    animationEnabled: false, // Deshabilita la animación de transición
                    headerShown: true,
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
                    options={{
                      headerLeft: () => null,
                      headerRight: () => <HeaderDropdown />,
                    }}
                  />
                  <Stack.Screen
                    name="AddVehicle"
                    component={AddVehicle}
                    options={{title:'Vehicle Creation',headerRight: () => <HeaderDropdown />}}
                  />
                  <Stack.Screen
                    name="AddInterestPoint"
                    component={AddInterestPoint}
                    options={{title:'Interest Point Creation',headerRight: () => <HeaderDropdown />}}
                  />
                  <Stack.Screen
                    name="RouteFinder"
                    component={RouteFinder}
                    options={{title:'Route Finder', headerRight: () => <HeaderDropdown />}}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </UserControllerProvider>
          </VehicleControllerProvider>
        </InterestPointControllerProvider>
      </RouteControllerProvider>
    </PaperProvider>
  );
};

export default App;
