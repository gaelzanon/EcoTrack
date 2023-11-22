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
import {useUserController} from '../contexts/UserControllerContext';

const Register = () => {
  const navigation = useNavigation();
  const userController = useUserController();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async () => {
    try {
      await userController.register({email, password});
      navigation.navigate('Login');
    } catch (error) {
      let message = 'An error occurred. Please try again.';
      switch (error.code) {
        case 'InvalidEmailException':
          message = 'The email address is invalid.';
          break;
        case 'InvalidPasswordException':
          message =
            'The password is invalid. It must be a string with at least six characters.';
          break;
        case 'auth/email-already-in-use':
          message = 'The provided email is already in use by an existing user.';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Check your connection.';
          break;
        default:
          console.log(error);
          break;
      }
      Alert.alert('Register Error', message);
    }
  };

  return (
    <ScrollView style={[globalStyles.primary, {flex: 1, padding: 20}]}>
      <View>
        <Text style={globalStyles.mainText}>Register</Text>
        <TextInput
          cursorColor="black"
          mode="flat"
          label="Email"
          style={styles.input}
          value={email}
          onChangeText={text => setEmail(text)}
        />

        <View
          style={{
            flexDirection: 'row',
          }}>
          <TextInput
            secureTextEntry={showPass ? false : true}
            cursorColor="black"
            mode="flat"
            label="Password"
            style={[styles.input, {width: '85%', marginBottom: 10}]}
            value={password}
            onChangeText={text => setPassword(text)}
          />

          <Pressable
            style={[
              styles.button,
              globalStyles.fullblack,
              {
                marginTop: 0,
                alignContent: 'center',
                justifyContent: 'center',
                width: '12%',
                marginLeft: 10,
                marginBottom: 10,
              },
            ]}
            onPress={() => {
              setShowPass(!showPass);
            }}>
            <MaterialCommunityIcons
              name={showPass ? 'eye-off' : 'eye'}
              size={20}
              color={globalStyles.white.backgroundColor}
            />
          </Pressable>
        </View>


        <Pressable
          style={[
            styles.button,
            globalStyles.secondary,
            {marginTop: 0, marginBottom: 30},
          ]}
          onPress={handleRegister}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </Pressable>

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
