import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Alert} from 'react-native';
import { Button } from 'react-native-elements';
import FooterList from '../components/FooterList';
import {COLORS} from './Colors';

export function Profile({route, navigation}: {route: any, navigation: any}): React.ReactElement {

  const { email, accounts } = route.params;  

  const logOut = function () {
    //TODO: ASYNC STORAGE
    navigation.push('SignIn');
  }
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.titleText}>Email: {email}</Text>
          <Button
            title="Log Out"
            titleStyle={styles.mainButton}
            onPress={logOut}
          />
        </View>
        <FooterList email={email} accounts={accounts}/>
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    mainButton: {
      width: 150,
      backgroundColor: COLORS.primary,
    },
    content: {
      flex: 1,
      alignItems: 'center',
    },
    scrollContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    viewWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleText: {
      fontSize: 20,
      color: 'black',
      marginTop: 20,
      marginBottom: 30,
      marginLeft: 15,
    }
});
