import React, {useState} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import axios from 'axios';
import {COLORS} from './Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export function Profile({route, navigation}: {route: any, navigation: any}): React.ReactElement {

  const logOut = function () {
    // I don't know what info is stored / needs to be stored.
    // I can do it, I just need to ask in the future.
    navigation.navigate('SignIn');
  }
  
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          <View style={styles.viewWrapper}>
            <Text style={styles.title}>This is the profile Page. I know.</Text>

            <Text style={styles.subtitle}>I went to the zoo the other day. It was really bad, they only had one dog. It was a Shih Tzu.</Text>

            <Button
              title="Log Out"
              titleStyle={styles.mainButton}
              onPress={logOut}
            />
            
          </View>
        </KeyboardAwareScrollView>
    );
  };

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
      color: COLORS.tertiary,
    },
  });