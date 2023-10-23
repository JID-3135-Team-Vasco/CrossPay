/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext } from 'react';
import {SignUp} from './screens/SignUp';
import {SignIn} from './screens/SignIn';
import {ForgotPassword} from './screens/ForgotPassword';
import {ForgotPasswordEnter} from './screens/ForgotPasswordEnter';
import {Profile} from  './screens/Profile';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Accounts } from './screens/Accounts';
import {AccountInfo} from './screens/AccountInfo';
import FooterList from './components/FooterList';
import { AuthContext } from './context/auth';

const Stack = createNativeStackNavigator();

const NavigationScreen = () => {
  const [state, setState] = useContext(AuthContext);
  const authenticated = state !== null && state.token !== "" && state.user !== null;

  return (
    <Stack.Navigator initialRouteName="Accounts">
        {authenticated ? 
        <> 
            <Stack.Screen
                name="Accounts"
                component={Accounts}
                options={() => ({
                    title: 'Accounts',
                    headerBackVisible: false,
                })}
            />
            <Stack.Screen
                name="AccountInfo"
                component={AccountInfo}
                options={() => ({
                    title: 'Account Info',
                    headerBackVisible: true,
                })}
            />
            
            <Stack.Screen name="Footer" component={FooterList}/>

            <Stack.Screen
                name="Profile"
                component={Profile}
                options={() => ({
                    title: 'Profile',
                    headerBackVisible: true,
                })}
            />
        </> : (
        <>
            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={() => ({
                    title: 'CrossPay',
                    headerBackVisible: false,
                })}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
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
        </>
        )}
    </Stack.Navigator>
  );
}

export default NavigationScreen;
