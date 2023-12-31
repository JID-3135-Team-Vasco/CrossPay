import React, {useState} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import axios from 'axios';
import {COLORS} from './Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ForgotPassword({navigation}): React.ReactElement {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

    const checkEmail = async () => {
        if (email === '') {
            Alert.alert('An email is required to change password');
            return;
        }
        const resp = await axios.post(`http://${address}:8000/users/forgot-password`, {
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
            <Text style={styles.title}>Please enter your email:</Text>
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
            <Button
              title="Back"
              type="clear"
              titleStyle={styles.secondaryButton}
              onPress={() => navigation.push('SignIn')}
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
      fontSize: 20,
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