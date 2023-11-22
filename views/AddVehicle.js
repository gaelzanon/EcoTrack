import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import globalStyles from '../styles';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useVehicleController} from '../contexts/VehicleControllerContext';

const AddVehicle = () => {
    const navigation = useNavigation();
    const vehicleController = useVehicleController();
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [averageConsumption, setAverageConsumption] = useState('');
    const [plate, setPlate] = useState('');

    const handleAddVehicle = async () => {
        //TODO: Crear vehículo y añadir creador
    }

    return (
        <ScrollView style={[globalStyles.primary, {flex: 1, padding: 20}]}>
            <View>
            <Text style={globalStyles.mainText}>New Vehicle</Text>

            <TextInput
            cursorColor="black"
            mode="flat"
            label="Brand"
            style={styles.input}
            value={brand}
            onChangeText={text => setBrand(text)}
            />

            <TextInput
            cursorColor="black"
            mode="flat"
            label="Model"
            style={styles.input}
            value={model}
            onChangeText={text => setModel(text)}
            />

            <TextInput
            cursorColor="black"
            mode="flat"
            label="Year"
            style={styles.input}
            value={year}
            onChangeText={text => setYear(text)}
            />

            <TextInput
            cursorColor="black"
            mode="flat"
            label="Avg. Consumption"
            style={styles.input}
            value={averageConsumption}
            onChangeText={text => setAverageConsumption(text)}
            />

            <TextInput
            cursorColor="black"
            mode="flat"
            label="Plate"
            style={styles.input}
            value={plate}
            onChangeText={text => setPlate(text)}
            />
            
            <Pressable
                style={[
                    styles.button,
                    globalStyles.secondary,
                    {marginTop: 0, marginBottom: 30},
                ]}
                onPress={handleAddVehicle}>
                <Text style={styles.buttonText}>CREATE</Text>
            </Pressable>
            </View>
        </ScrollView>
    );
};
    
const styles = StyleSheet.create({

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
});
export default AddVehicle;
