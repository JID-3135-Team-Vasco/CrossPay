import React, {useState} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import axios from 'axios';
import {COLORS} from './Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ForgotPassword({navigation}): React.ReactElement {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    console.log(email);

    const checkEmail = async () => {
        if (email === '') {
            Alert.alert('An email is required to change password');
            return;
        }
        const resp = await axios.post('http://10.0.2.2:8000/api/forgot-password', {
          email,
        });
        if (resp.data.error) {
          Alert.alert(resp.data.error);
        } else {
          await AsyncStorage.setItem("res-Email", JSON.stringify(email));
          navigation.push('ForgotPasswordEnter');
        }
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          <View style={styles.viewWrapper}>
            <Text style={styles.title}>CrossPay</Text>
            <Input
                placeholder="Email"
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <Button
                title="Send"
                onPress={checkEmail}
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