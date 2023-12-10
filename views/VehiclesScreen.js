import React from 'react';
import {View, Text, Pressable, StyleSheet, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useAsyncStorage} from '../contexts/AsyncStorageContext';
import globalStyles from '../styles';

const VehiclesScreen = () => {
  const navigation = useNavigation();
  const {vehicles} = useAsyncStorage();
  const handleNavigateToAddVehicle = () => {
    navigation.navigate('AddVehicle');
  };

  const renderVehicles = ({item}) => <VehicleCard vehicle={item} />;

  const VehicleCard = ({vehicle}) => (
    <View style={styles.card}>
      <Text style={styles.plate}>{vehicle.plate}</Text>
      <Text style={styles.details}>Brand: {vehicle.brand}</Text>
      <Text style={styles.details}>Model: {vehicle.model}</Text>
      <Text style={styles.details}>Year: {vehicle.year}</Text>
      <Text style={styles.details}>
        Avg. Consumption: {vehicle.averageConsumption}
      </Text>
      <Text style={styles.details}>Type: {vehicle.type}</Text>
    </View>
  );
  return (
    <View style={[globalStyles.primary, {flex: 1, padding: 20}]}>
      <FlatList
        data={vehicles}
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
