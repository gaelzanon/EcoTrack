import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, StyleSheet, FlatList, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAsyncStorage} from '../contexts/AsyncStorageContext';
import {useVehicleController} from '../contexts/VehicleControllerContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles from '../styles';

const VehiclesScreen = () => {
  const navigation = useNavigation();
  const {vehicles, setVehicles} = useAsyncStorage();
  const handleNavigateToAddVehicle = () => {
    navigation.navigate('AddVehicle');
  };
  const [localVehicles, setLocalVehicles] = useState(vehicles ? vehicles : []);
  const vehiclesController = useVehicleController();

  const handleDeleteVehicle = async vehicle => {
    Alert.alert('DELETE Vehicle', 'Do you want to delete this vehicle?', [
      {
        text: 'OK',
        onPress: async () => {
          try {
            await vehiclesController.removeVehicle(vehicle);
            // Filtrar la lista para eliminar el punto de interés
            const updatedVehicles = vehicles.filter(
              item => item.plate !== vehicle.plate,
            );
            // Guardar la lista actualizada
            setVehicles(updatedVehicles);
            Alert.alert('Vehicle succesfully deleted.');
          } catch (error) {
            let message = 'An error occurred. Please try again.';
            switch (error.code) {
              case 'VehicleNotFoundException':
                message = "Vehicle doesn't exist.";
                break;
              default:
                console.log(error);
                break;
            }
            Alert.alert('Deletion Error', message);
          }
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  useEffect(() => {
    async function fetchVehicles() {
      const vehicles = await vehiclesController.getVehicles();
      setLocalVehicles(vehicles);
    }

    fetchVehicles();
  }, [vehicles]);

  const renderVehicles = ({item}) => <VehicleCard vehicle={item} />;

  const VehicleCard = ({vehicle}) => (
    <View
      style={[
        styles.card,
        {
          flexDirection: 'row',
        },
      ]}>
      <View style={{flex: 1}}>
        <Text style={styles.plate}>{vehicle.plate}</Text>
        <Text style={styles.details}>Brand: {vehicle.brand}</Text>
        <Text style={styles.details}>Model: {vehicle.model}</Text>
        <Text style={styles.details}>Year: {vehicle.year}</Text>
        <Text style={styles.details}>
          Avg. Consumption: {vehicle.averageConsumption}
        </Text>
        <Text style={styles.details}>Type: {vehicle.type}</Text>
      </View>
      <View style={{flex: 2, position: 'absolute', right: 13, top: 13}}>
        <Pressable onPress={() => handleDeleteVehicle(vehicle)}>
          <MaterialCommunityIcons
            name={'trash-can'}
            size={30}
            color="#8f0916"
          />
        </Pressable>
      </View>
    </View>
  );
  return (
    <View style={[globalStyles.primary, {flex: 1, padding: 20}]}>
      <FlatList
        data={localVehicles}
        keyExtractor={item => item.plate}
        renderItem={renderVehicles}
        ListFooterComponent={
          <Pressable
            style={[styles.button, globalStyles.secondary]}
            onPress={handleNavigateToAddVehicle}>
            <Text style={styles.buttonText}>NEW VEHICLE</Text>
          </Pressable>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  plate: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
  },
});

export default VehiclesScreen;
