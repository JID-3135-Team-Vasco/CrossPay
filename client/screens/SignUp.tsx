import React, {useState} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import axios from 'axios';
import {COLORS} from './Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export function SignUp({navigation}): React.ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

  const onPressSignUp = async () => {
    if (name === '' || email === '' || password === '') {
      Alert.alert('All fields are required!');
      return;
    }
    const resp = await axios.post(`http://${address}:8000/users/signin`, {
      name,
      email,
      password,
    });
    if (resp.data.error) {
      Alert.alert(resp.data.error);
    } else {
      Alert.alert('Signup successful!');
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.viewWrapper}>
        <Text style={styles.title}>CrossPay</Text>
        <Input
          placeholder="Name"
          onChangeText={setName}
          autoCapitalize="words"
        />
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
          title="Create Account"
          onPress={onPressSignUp}
          buttonStyle={styles.mainButton}
        />
        <Button
          title="Already have an account? Log In"
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
