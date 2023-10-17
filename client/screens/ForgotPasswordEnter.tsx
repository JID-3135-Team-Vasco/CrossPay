import React, {useState, useContext} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import axios from 'axios';
import {COLORS} from './Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ForgotPasswordEnter({navigation}): React.ReactElement {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConPassword] = useState('');
    // Currently necessary because of iOS and Android differences in emulators.
    // Fixed a previous issue with axios posts.
    const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

    const onPressConfirmPass = async () => {
      if (password.localeCompare(confirmPassword) === 0) {
        var email = await AsyncStorage.getItem('res-Email');
        if (email != null) {
          email = email.substring(1, email.length - 1);
          const resp = await axios.post(`http://${address}:8000/users/reset-password`, {
            email, password,
          });
          if (resp.data.error) {
            Alert.alert("Error: Email was not accepted. Please try again.");
            Alert.alert(resp.data.error);
            return;
          } else {
            Alert.alert("Password Successfully Changed");
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
                secureTextEntry={true}
            />
            <Input
                placeholder="Confirm Password"
                onChangeText={setConPassword}
                autoCapitalize="none"
                secureTextEntry={true}
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