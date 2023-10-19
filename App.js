import React, {useState} from 'react';
import {StyleSheet,  View, TextInput, Button} from 'react-native';
import MapView, {Polyline, Marker} from 'react-native-maps';
import { calculateRoute, geoCoding } from './OpenRouteService';
const App = () => {
  const [showMap, setShowMap] = useState(false);
  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});
  const [route, setRoute] = useState([]);

  const findRoute = async () => {
    try {
      const originCoords = await geoCoding(originName);
      const destinationCoords = await geoCoding(destinationName);

      setOrigin(originCoords);
      setDestination(destinationCoords);

      const start = `${originCoords.longitude},${originCoords.latitude}`;
      const end = `${destinationCoords.longitude},${destinationCoords.latitude}`;

      const response = await calculateRoute(start, end);
      setRoute(
        response.features[0].geometry.coordinates.map(coord => ({
          latitude: coord[1],
          longitude: coord[0],
        }))
      );

      setShowMap(true);
    } catch (error) {
      console.error("Error finding route:", error);
    }
  };

  return (
    <View style={{backgroundColor: '#F5F5F5', flex: 1}}>
      {showMap ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker coordinate={origin} />
          <Marker coordinate={destination} />
          <Polyline coordinates={route} strokeColor="#000" strokeWidth={3} />
        </MapView>
      ) : (
        <>
          
          <TextInput
            style={styles.input}
            placeholder="Ciudad Origen"
            value={originName}
            onChangeText={text => setOriginName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Ciudad Destino"
            value={destinationName}
            onChangeText={text => setDestinationName(text)}
          />
          <Button title="Find Route" onPress={findRoute} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default App;
