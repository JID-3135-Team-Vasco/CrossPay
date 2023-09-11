import React, {useState, useContext} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import axios from 'axios';
import {COLORS} from './Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ForgotPasswordEnter({navigation}): React.ReactElement {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConPassword] = useState('');

    const onPressConfirmPass = async () => {
      if (password.localeCompare(confirmPassword) === 0) {
        var email = await AsyncStorage.getItem('res-Email');
        if (email != null) {
          email = email.substring(1, email.length - 1);
        const resp = await axios.post('http://10.0.2.2:8000/api/reset-password', {
          email, password,
        });
        if (resp.data.error) {
          Alert.alert(resp.data.error);
          return;
        } else {
          Alert.alert("Password Succesfully Changed");
          navigation.push('SignIn');
          return;
        }
        }
      }
      Alert.alert("The password entries are not identical.");
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          <View style={styles.viewWrapper}>
            <Text style={styles.title}>CrossPay</Text>
            <Input
                placeholder="Password"
                onChangeText={setPassword}
                autoCapitalize="none"
            />
            <Input
                placeholder="Confirm Password"
                onChangeText={setConPassword}
                autoCapitalize="none"
            />
            <Button
                title="Change Password"
                onPress={onPressConfirmPass}
                buttonStyle={styles.mainButton}
            />
          </View>
        </KeyboardAwareScrollView>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    viewWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
    },
    subtitle: {
      fontSize: 14,
      padding: 10,
      color: 'gray',
      textAlign: 'center',
    },
    mainButton: {
      width: 350,
      backgroundColor: COLORS.primary,
    },
    secondaryButton: {
      color: COLORS.primary,
    },
});