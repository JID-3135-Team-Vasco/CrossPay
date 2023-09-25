import React, {useState} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import axios from 'axios';
import {COLORS} from './Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Accounts } from './Accounts';

export function SignIn({navigation}): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onPressSignIn = async () => {
    if (email === '' || password === '') {
      Alert.alert('All fields are required!');
      return;
    }
    const resp = await axios.post('http://localhost:8000/api/signin', {
      email,
      password,
    });
    if (resp.data.error) {
      Alert.alert(resp.data.error);
    } else {
      Alert.alert('Login successful!');
      navigation.navigate(Accounts);
      
      
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.viewWrapper}>
        <Text style={styles.title}>CrossPay</Text>
        <Input
          placeholder="Email"
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Button
          title="Log In"
          onPress={onPressSignIn}
          buttonStyle={styles.mainButton}
        />
        <Button
          title="Don't have an account? Create Account"
          type="clear"
          titleStyle={styles.secondaryButton}
          onPress={() => navigation.push('SignUp')}
        />
        <Button
          title="Forgot Password?"
          type="clear"
          titleStyle={styles.secondaryButton}
          onPress={() => navigation.push('ForgotPassword')}
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
