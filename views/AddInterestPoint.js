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
import {useAsyncStorage} from '../contexts/AsyncStorageContext';
import { useInterestPointController } from '../contexts/InterestPointControllerContext';
import InterestPoint from '../models/InterestPoint';
const AddInterestPoint = () => {
  const navigation = useNavigation();
  const interestPointController = useInterestPointController();
  const { user } = useAsyncStorage(); // Obtener el usuario del contexto de AsyncStorage

  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleAddInterestPoint = async () => {
    try {
      const userEmail = user ? user.email : null;
      if (!userEmail) {
        Alert.alert('Error', 'User information not found.');
        return;
      }

      const newInterestPoint = new InterestPoint(
        userEmail,
        name,
        parseFloat(latitude),
        parseFloat(longitude),
      );

      await interestPointController.registerInterestPoint(newInterestPoint);
      Alert.alert('Interest Point Added', 'Your interest point has been successfully added.');
      // Navegar a otra pantalla o actualizar la vista si es necesario
    } catch (error) {
      let errorMessage = 'Failed to add interest point.';
      if (error instanceof Error && error.message === 'InvalidCoordinatesException') {
        errorMessage = 'The coordinates of the interest point are not valid.';
      } else if (error.code) {
        // Aquí manejaremos errores específicos de Firebase si es necesario
        errorMessage = `Firebase error: ${error.message}`;
      }
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <ScrollView style={[globalStyles.primary, {flex: 1, padding: 20}]}>
      <View>
        <Text style={globalStyles.mainText}>New Interest Point</Text>

        <TextInput
          cursorColor="black"
          mode="flat"
          label="Name"
          style={styles.input}
          value={name}
          onChangeText={text => setName(text)}
        />

        <TextInput
          cursorColor="black"
          mode="flat"
          label="Latitude"
          style={styles.input}
          value={latitude}
          onChangeText={text => setLatitude(text)}
        />

        <TextInput
          cursorColor="black"
          mode="flat"
          label="Longitude"
          style={styles.input}
          value={longitude}
          onChangeText={text => setLongitude(text)}
        />

        <Pressable
          style={[styles.button, globalStyles.secondary, {marginTop: 0, marginBottom: 30}]}
          onPress={handleAddInterestPoint}>
          <Text style={styles.buttonText}>CREATE INTEREST POINT</Text>
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
export default AddInterestPoint;
