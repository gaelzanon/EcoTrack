import React, {useState} from 'react';
import {StyleSheet,  View, TextInput, Button} from 'react-native';
import MapView, {Polyline, Marker} from 'react-native-maps';
import axios from 'axios';

const App = () => {
  const [showMap, setShowMap] = useState(false);
  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});
  const [route, setRoute] = useState([]);
  const apiKey = '5b3ce3597851110001cf624890104ad5d8c9453d90c93dcd210dc008';

  const calculateRoute = async (start, end) => {
    const response = await axios.get(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`,
    );
    setRoute(
      response.data.features[0].geometry.coordinates.map(coord => ({
        latitude: coord[1],
        longitude: coord[0],
      })),
    );
  };

  const geoCoding = async name => {
    const response = await axios.get(
      `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${name}`,
    );
    const location = response.data.features[0].geometry.coordinates;
    return {latitude: location[1], longitude: location[0]};
  };

  const findRoute = async () => {
    const originCoords = await geoCoding(originName);
    const destinationCoords = await geoCoding(destinationName);

    setOrigin(originCoords);
    setDestination(destinationCoords);

    const start = `${originCoords.longitude},${originCoords.latitude}`;
    const end = `${destinationCoords.longitude},${destinationCoords.latitude}`;

    await calculateRoute(start, end);
    setShowMap(true);
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
