import React, {useState} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {useRouteController} from '../contexts/RouteControllerContext';
import {useAsyncStorage} from '../contexts/AsyncStorageContext';
import {Picker} from '@react-native-picker/picker';
import InterestPoint from '../models/InterestPoint';
import Vehicle from '../models/Vehicle';
import Route from '../models/Route';
import globalStyles from '../styles';
const RouteFinder = () => {
  const routeController = useRouteController();
  const {vehicles, interestPoints, user} = useAsyncStorage();

  const [showMap, setShowMap] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');

  const [selectedVehicleOption, setSelectedVehicleOption] = useState('generic');
  const [selectedOriginOption, setSelectedOriginOption] = useState('custom');
  const [selectedDestinationOption, setSelectedDestinationOption] =
    useState('custom');

  const [selectedGenericVehicleType, setSelectedGenericVehicleType] =
    useState('walking');

  const [selectedVehicle, setSelectedVehicle] = useState(
    vehicles && vehicles.length > 0 ? vehicles[0].plate : null,
  );
  const [selectedOrigin, setSelectedOrigin] = useState(
    interestPoints && interestPoints.length > 0 ? interestPoints[0].name : null,
  );
  const [selectedDestination, setSelectedDestination] = useState(
    interestPoints && interestPoints.length > 0 ? interestPoints[0].name : null,
  );

  const [useCustomVehicle, setUseCustomVehicle] = useState(false);
  const [useCustomOrigin, setuseCustomOrigin] = useState(false);
  const [useCustomDestiny, setuseCustomDestiny] = useState(false);

  const findRoute = async () => {
    try {
      // Decide si usar puntos de interés personalizados o toponímicos
      const origin = useCustomOrigin
        ? interestPoints.find(ip => ip.name === selectedOrigin)
        : new InterestPoint(user.email, originName);
      const destination = useCustomDestiny
        ? interestPoints.find(ip => ip.name === selectedDestination)
        : new InterestPoint(user.email, destinationName);
      // Decide si usar vehículo personalizado o genérico
      const vehicle = useCustomVehicle
        ? vehicles.find(v => v.plate === selectedVehicle)
        : new Vehicle(
            user.email,
            'Generic',
            'Generic',
            2020,
            0,
            'GENERIC',
            selectedGenericVehicleType,
          );

      // Crea un objeto Route
      const route = new Route(
        user.email,
        origin,
        destination,
        vehicle,
        'fastest',
      );

      // Obtiene la ruta del RouteController
      const journey = await routeController.getRoute(route);

      // Actualiza el estado para mostrar la ruta en el mapa
      setRouteCoordinates(journey.coordinates);
      setShowMap(true);
    } catch (error) {
      let message = 'An error occurred. Please try again.';
      switch (error.code) {
        case 'NoInetConection':
          message = 'You need internet to get routes.';
          break;
        case 'InvalidInterestPointException':
          message = 'There is an invalid interest point.';
          break;
        case 'RouteNotAvailableException':
          message = `There wansn't a route found.`;
          break;
        default:
          console.log(error);
          break;
      }
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={[globalStyles.primary, {flex: 1, padding: 20}]}>
      {showMap ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: routeCoordinates[0]?.latitude,
              longitude: routeCoordinates[0]?.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker coordinate={routeCoordinates[0]} />
            <Marker
              coordinate={routeCoordinates[routeCoordinates.length - 1]}
            />
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#000"
              strokeWidth={3}
            />
          </MapView>
          <View
            style={[
              globalStyles.black,
              {position: 'absolute', bottom: 0, width: '100%'},
            ]}>
            <Text
              style={[
                styles.label,
                {color: globalStyles.white.backgroundColor},
              ]}>
              Test
            </Text>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.label}>Vehicle</Text>
          {vehicles && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedVehicleOption}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedVehicleOption(itemValue);
                  setUseCustomVehicle(itemValue === 'custom');
                }}>
                <Picker.Item label="Own" value="custom" />
                <Picker.Item label="Generic" value="generic" />
              </Picker>
            </View>
          )}

          {selectedVehicleOption === 'custom' ? (
            <>
              {vehicles && vehicles.length > 0 ? (
                <Picker
                  selectedValue={selectedVehicle}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedVehicle(itemValue);
                  }}>
                  {vehicles.map(v => (
                    <Picker.Item
                      key={v.plate}
                      label={v.model}
                      value={v.plate}
                    />
                  ))}
                </Picker>
              ) : (
                <Text>No custom vehicles created yet</Text>
              )}
            </>
          ) : (
            <Picker
              selectedValue={selectedGenericVehicleType}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedGenericVehicleType(itemValue);
              }}>
              <Picker.Item label="Walk" value="walking" />
              <Picker.Item label="Bycicle" value="bike" />
              <Picker.Item label="Diesel car" value="diesel" />
              <Picker.Item label="Electric car" value="electric" />
              <Picker.Item label="Gasoline car" value="gasoline" />
            </Picker>
          )}
          <Text style={styles.label}>Origin</Text>
          {interestPoints && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedOriginOption}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedOriginOption(itemValue);
                  setuseCustomOrigin(itemValue !== 'custom');
                }}>
                <Picker.Item label="Toponymic" value="custom" />
                <Picker.Item label="Own" value="own" />
              </Picker>
            </View>
          )}

          {selectedOriginOption === 'custom' ? (
            <TextInput
              cursorColor="black"
              mode="flat"
              label="Origin Toponym"
              style={styles.input}
              value={originName}
              onChangeText={text => setOriginName(text)}
            />
          ) : (
            <>
              {interestPoints && interestPoints.length > 0 ? (
                <Picker
                  selectedValue={selectedOrigin}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedOrigin(itemValue);
                  }}>
                  {interestPoints.map(ip => (
                    <Picker.Item
                      key={ip.name}
                      label={ip.name}
                      value={ip.name}
                    />
                  ))}
                </Picker>
              ) : (
                <Text>No custom interest points created yet</Text>
              )}
            </>
          )}
          <Text style={styles.label}>Destination</Text>
          {interestPoints && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDestinationOption}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedDestinationOption(itemValue);
                  setuseCustomDestiny(itemValue !== 'custom');
                }}>
                <Picker.Item label="Toponymic" value="custom" />
                <Picker.Item label="Own" value="own" />
              </Picker>
            </View>
          )}

          {selectedDestinationOption === 'custom' ? (
            <TextInput
              cursorColor="black"
              mode="flat"
              label="Destination Toponym"
              style={styles.input}
              value={destinationName}
              onChangeText={text => setDestinationName(text)}
            />
          ) : (
            <>
              {interestPoints && interestPoints.length > 0 ? (
                <Picker
                  selectedValue={selectedDestination}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedDestination(itemValue);
                  }}>
                  {interestPoints.map(ip => (
                    <Picker.Item
                      key={ip.name}
                      label={ip.name}
                      value={ip.name}
                    />
                  ))}
                </Picker>
              ) : (
                <Text>No custom interest points created yet</Text>
              )}
            </>
          )}
          <Pressable
            style={[
              styles.button,
              globalStyles.secondary,
              {marginTop: 0, marginBottom: 30},
            ]}
            onPress={findRoute}>
            <Text style={styles.buttonText}>Find Route</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    padding: 10,
    marginBottom: 10,
    ...globalStyles.white,
    borderWidth: 1,
    borderColor: 'black',
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#3b3b3b',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
});

export default RouteFinder;
