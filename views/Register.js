import React, {useState} from 'react';
import {StyleSheet, View, Pressable, Text, ScrollView} from 'react-native';
import {TextInput} from 'react-native-paper';
import globalStyles from '../styles';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Register = () => {

  const navigation = useNavigation();


  return (
    <ScrollView style={[globalStyles.primary, {flex: 1, padding: 20}]}>
      <View>
        <Text style={globalStyles.mainText}>Register</Text>
        
        <Pressable
          style={[
            styles.button,
            globalStyles.fullblack,
            {marginTop: 0, marginBottom: 30},
          ]}
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            Already have an account? Click here to log in.
          </Text>
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

export default Register;
