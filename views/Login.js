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
const Login = () => {
  const navigation = useNavigation();
  const userController = useUserController();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    try {
      await userController.login({email, password});
      // Manejar el éxito del login
    } catch (error) {
      let message = 'An error occurred. Please try again.';
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'The email address is invalid.';
          break;
        case 'auth/invalid-login-credentials':
          message = 'There isnt any user found with those credentials.';
          break;
        case 'auth/user-disabled':
          message = 'Your account has been disabled.';
          break;
        case 'auth/user-not-found':
          message = 'User not found.';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password.';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Check your connection.';
          break;
        default:
          console.log(error);
          break;
      }
      Alert.alert('Login Error', message);
    }
  };

  return (
    <ScrollView style={[globalStyles.primary, {flex: 1, padding: 20}]}>
      <View>
        <Text style={globalStyles.mainText}>Log In</Text>
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
          onPress={handleLogin}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            globalStyles.fullblack,
            {marginTop: 0, marginBottom: 30},
          ]}
          onPress={() => {
            navigation.navigate('Register');
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            Dont have an account? Click here to register.
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  appLogo: {
    height: 200,
    width: 250,
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
});

export default Login;
