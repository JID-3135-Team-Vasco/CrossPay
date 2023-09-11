/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SignUp} from './screens/SignUp';
import {SignIn} from './screens/SignIn';
import {ForgotPassword} from './screens/ForgotPassword';
import {ForgotPasswordEnter} from './screens/ForgotPasswordEnter';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={() => ({
              title: 'CrossPay',
              headerBackVisible: false,
            })}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={() => ({
              title: 'CrossPay',
              headerBackVisible: false,
            })}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={() => ({
              title: 'CrossPay',
              headerBackVisible: false,
            })}
          />
          <Stack.Screen
            name="ForgotPasswordEnter"
            component={ForgotPasswordEnter}
            options={() => ({
              title: 'CrossPay',
              headerBackVisible: false,
            })}
          />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
