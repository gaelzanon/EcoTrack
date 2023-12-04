import React, {useState} from 'react';
import { 
    StyleSheet,
    View, 
    Text,
    Alert,
    Pressable
} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUserController} from '../contexts/UserControllerContext';
import {useNavigation} from '@react-navigation/native';
import globalStyles from '../styles';
import {useAsyncStorage} from '../contexts/AsyncStorageContext';
import { Dropdown } from 'react-native-element-dropdown';

const HeaderDropdown = () => {
    const navigation = useNavigation();
    const userController = useUserController();
    const [value, setValue] = useState(null);
    const {user} = useAsyncStorage();

    const dropdownMenu = [
        {label: 'Delete User', value: 'delete'},
    ];

    // Eliminar usuario
    const deleteUser = () => {

        Alert.alert('DELETE ACCOUNT','Do you want to delete this user account?', [
        {
            text: 'OK', 
            onPress: () => {  
            try {
                if (!user) {
                Alert.alert('Error', 'User information not found.');
                return;
                }
                userController.deleteUser(user.email);
                Alert.alert('Account succesfully deleted.');
                navigation.navigate('Login');
            } catch (error) {
                let message = 'An error occurred. Please try again.';
                switch (error.code) {
                case 'UserNotFoundException':
                    message = "User doesn't exist.";
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

    // Menú en cabecera
    const handleMenu = (value) => {
        switch(value) {
        case 'delete':
            deleteUser();
            break;
        default:
            console.log('nada');
            break;
        }
    }

    // Desplegable del menú de cabecera
    const renderItem = item => {
        return (
        <View style={styles.item}>
            <Text style={styles.textItem}>{item.label}</Text>
            {item.value === value && (
            <Pressable
                onPress={deleteUser}
                style={{marginRight: 10}}>
            </Pressable>
            )}
        </View>
        );
    };

    // Icono del desplegable customizado
    const customIcon = () => {
        return(
        <MaterialCommunityIcons
            name={'cog'}
            size={30}
            color={globalStyles.white.backgroundColor}
        />
        );
    }

    const delay = ms => new Promise(res => setTimeout(res, ms));

    return(
        <Dropdown
            style={styles.dropdown}
            iconStyle={styles.iconStyle}
            data={dropdownMenu}
            labelField="label"
            valueField="value"
            placeholderStyle={{color: 'transparent'}}
            selectedTextStyle={{color: 'transparent'}}
            onChange={async item => {
                setValue(item.value);
                handleMenu(item.value);
            }}
            renderRightIcon={customIcon}
            value={value}
            renderItem={renderItem}
        />
    )
};

const styles = StyleSheet.create({
    dropdown: {
      margin: 10,
      height: 30,
      width: 150,
      backgroundColor: 'transparent',
      borderRadius: 1,
      padding: 5,
      elevation: 0,
    },
    item: {
      padding: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textItem: {
      flex: 1,
      fontSize: 16,
    },
    placeholder: {
      color: 'white',
      fontSize: 14
    }
});

export default HeaderDropdown;