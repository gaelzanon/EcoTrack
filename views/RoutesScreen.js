import React from 'react';
import {View, Text, Pressable, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import globalStyles from '../styles';

const RoutesScreen = () => {
  const navigation = useNavigation();



  const handleNavigateToRouteFinder = () => {
    navigation.navigate('RouteFinder');
  };

  const handleNavigateToPreferences = () => {
    navigation.navigate('Preferences');
  };

  return (
    <ScrollView style={[globalStyles.primary, { flex: 1, padding: 20 }]}
      showsVerticalScrollIndicator={false}>
      <View>

        <Pressable
          style={[styles.button, globalStyles.secondary]}
          onPress={handleNavigateToRouteFinder}>
          <Text style={styles.buttonText}>Find a Route</Text>
        </Pressable>
        <Pressable
            style={[styles.button, globalStyles.secondary]}
            onPress={handleNavigateToPreferences}>
            <Text style={styles.buttonText}>Route Preferences</Text>
          </Pressable>
      </View>
    </ScrollView>
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
});

export default RoutesScreen;
