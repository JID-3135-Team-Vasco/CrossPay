/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { AuthProvider } from './context/auth';
import NavigationScreen from './NavigationScreen';

const Navigation = () => {

  return (
    <NavigationContainer>
      <AuthProvider>
        <NavigationScreen />
      </AuthProvider>
    </NavigationContainer>
  );
}

export default Navigation;
