import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {COLORS} from './Colors';
import { TouchableOpacity } from 'react-native';
import FooterList from '../components/FooterList';

export function AccountInfo({route, navigation}: {route: any, navigation: any}): React.ReactElement {
  const { name } = route.params.item;
  const balance = route.params.item.type === "credit" ? route.params.item.balances['current'] : route.params.item.balances['available']
  
  

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titleText}>{name}</Text>
        <Text style={styles.balanceText}>Balance: ${balance}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit Account Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      <FooterList/>
    </View>
    

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    elevation: 4,
    alignItems: 'center', 
    marginBottom: 20, 
  },
  editButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 30, 
    marginLeft: 15,
  },
  deleteButton: {
    backgroundColor: COLORS.red,
    padding: 10,
    borderRadius: 30,
    marginRight: 15,
  },
  buttonText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  bottom: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 32,
      paddingBottom: 64,
  },
  balanceText: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
    marginLeft: 15,
  },
  titleText: {
    fontSize: 25, 
    fontWeight: 'bold', 
    alignSelf: 'center', 
    paddingTop: 20, 
    color: 'black'
  }
});

